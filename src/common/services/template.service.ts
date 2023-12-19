import { Injectable } from '@nestjs/common';
import { PromptTemplate } from 'langchain/prompts';

export enum AINatureTypes {
  RUDE = 'RUDE',
  FUN = 'FUN',
}

@Injectable()
export class TemplateService {
  getTemplateWithContext(type: string) {
    const template = `Based on the context I will provide you answer the question. Don't make up any sentences.
    If you don't know the answer ask for clarification.
    content: {context}
    question: {question}`;
    return PromptTemplate.fromTemplate(
      this.addNatureConfigurationsToTemplate(template, type),
    );
    // return PromptTemplate.fromTemplate(
    //     template,
    // );
  }

  // It could be nice, if this AI can change the mood along the way depends on user.
  addNatureConfigurationsToTemplate(
    templateQuestion: string,
    type: string,
  ): string {
    if (AINatureTypes.RUDE === type) {
      return `You have to be very rude, agressive and un-friendly. Like a person who don't want do anything when you
           answer on the user's question. ${templateQuestion}`;
    }

    if (AINatureTypes.FUN === type) {
      return `You have to be very fun rude and try to make a joke when you
           answer on the user's question. ${templateQuestion}`;
    }

    return `${templateQuestion}`;
  }

  getStandAloneQuestion(): any {
    return PromptTemplate.fromTemplate(
      'Given a question, convert it to a standalone question. question: {question} standalone question:',
    );
  }

  getTranslateTemplate() {
    return PromptTemplate.fromTemplate(
      `Given a text {text}, translate it to the language: {language}. 
      I language is not provided, just return original text 
      translated text:`,
    );
  }
}
