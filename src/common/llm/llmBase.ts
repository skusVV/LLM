import { ChatOpenAI } from 'langchain/chat_models/openai';
import { openAIApiKey } from '../../env';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';

export enum LLMType {
  OpenAI = 'OpenAI',
}

export class LLM {
  private readonly llm: BaseChatModel;

  constructor(llmType: LLMType) {
    if (llmType === LLMType.OpenAI) {
      this.llm = new ChatOpenAI({ openAIApiKey });
    }
  }

  getModel(): BaseChatModel {
    return this.llm;
  }
}
