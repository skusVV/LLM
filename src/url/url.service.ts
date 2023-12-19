import { Injectable } from '@nestjs/common';
import { compile } from 'html-to-text';
import * as cheerio from 'cheerio';
import { RecursiveUrlLoader } from 'langchain/document_loaders/web/recursive_url';
import { TokenTextSplitter, TextSplitter } from 'langchain/text_splitter';
import { loadSummarizationChain } from 'langchain/chains';
import { LLM, LLMType } from '../common/llm/llmBase';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import {
  RunnableSequence,
  RunnablePassthrough,
} from 'langchain/schema/runnable';
import { StringOutputParser } from 'langchain/schema/output_parser';
import { TemplateService } from '../common/services/template.service';

@Injectable()
export class UrlService {
  private readonly splitter: TextSplitter;
  private readonly llm: BaseChatModel;

  constructor(private templateService: TemplateService) {
    this.splitter = new TokenTextSplitter({
      chunkSize: 10000,
      chunkOverlap: 250,
    });
    this.llm = new LLM(LLMType.OpenAI).getModel();
  }

  async test(url: string, language: string) {
    const docs = await this.loadUrl(url);
    const docsSummary = await this.splitter.splitDocuments(docs);

    const summarizeChain = loadSummarizationChain(this.llm, {
      type: 'stuff',
      verbose: false,
    });

    const translationTemplate = this.templateService
      .getTranslateTemplate()
      .pipe(this.llm)
      .pipe(new StringOutputParser());

    const chain = RunnableSequence.from([
      {
        summary: summarizeChain,
        original_input: new RunnablePassthrough(),
      },
      (data) => ({
        text: data.summary.text,
        language: data.original_input.language,
      }),
      translationTemplate,
    ]);

    return chain.invoke({ input_documents: docsSummary, language });
  }

  private async loadUrl(url: string) {
    const compiledConvert = compile({
      wordwrap: 130,
    });

    const loader = new RecursiveUrlLoader(url, {
      extractor: (html) => {
        const $ = cheerio.load(html);
        const relevantText = $('article').not('script, style, svg').html();

        return compiledConvert(relevantText);
      },
      maxDepth: 1,
    });

    return loader.load();
  }
}
