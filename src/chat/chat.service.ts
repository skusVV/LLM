import { Injectable } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import {
  RunnableSequence,
  RunnablePassthrough,
} from 'langchain/schema/runnable';
import { openAIApiKey } from '../env';
import { TemplateService } from './services/template.service';
import { LLM, LLMType } from './llm/llmBase';
import { VectorStore } from '@langchain/core/vectorstores';
import { TextSplitter } from 'langchain/dist/text_splitter';
import { StoreBase, StoreType } from './stores/storeBase';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import {pipeLogger} from "../utils";

@Injectable()
export class ChatService {
  private readonly llm: BaseChatModel;
  private readonly splitter: TextSplitter;
  private readonly vectorStore: VectorStore;

  constructor(private templateService: TemplateService) {
    this.llm = new LLM(LLMType.OpenAI).getModel();
    this.splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      separators: ['\n\n', '\n', ' ', ''], // default setting
    });
    this.vectorStore = new StoreBase(
      StoreType.Pinecone,
      new OpenAIEmbeddings({ openAIApiKey }),
    ).getStore();
  }

  async generateResponse(question: string): Promise<any> {
    const standAloneQuestionChain = RunnableSequence.from([
      (data) => ({ question: data.question }),
      this.templateService.getStandAloneQuestion(),
      this.llm,
      (data) => data.content,
    ]);

    const retrieverChain = RunnableSequence.from([
      (data) => data.standalone_question,
      this.vectorStore.asRetriever(),
      (docs) => docs.map((doc) => doc.pageContent).join('\n\n'),
    ]);

    const chain = RunnableSequence.from([
      {
        standalone_question: standAloneQuestionChain,
        original_input: new RunnablePassthrough(),
      },
      {
        context: retrieverChain,
        question: ({ original_input }) => original_input.question,
      },
      {
        result: RunnableSequence.from([
          (data) => ({ context: data.context, question: data.question }),
          this.templateService.getTemplateWithContext('FUN'),
          this.llm,
          (data) => data.content,
        ]),
      },
    ]);

    return await chain.invoke({ question });
  }
}
