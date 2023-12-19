import { Injectable } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { openAIApiKey } from '../env';
import { TemplateService } from '../common/services/template.service';
import { TextSplitter } from 'langchain/dist/text_splitter';
import { StoreBase, StoreType } from '../common/stores/storeBase';
import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';
import { PineconeStore } from 'langchain/vectorstores/pinecone';

@Injectable()
export class PdfService {
  private readonly splitter: TextSplitter;
  private readonly vectorStore: any;

  constructor(private templateService: TemplateService) {
    this.splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      separators: ['\n\n', '\n', ' ', ''], // default setting
    });
    this.vectorStore = new StoreBase(
      StoreType.Pinecone,
      new OpenAIEmbeddings({ openAIApiKey }),
    );
  }

  private async loadPdf(path: string) {
    const dataBuffer = fs.readFileSync(path);
    const res = await pdfParse(dataBuffer);

    return res;
  }
  async initPdfFile(path: string) {
    const { text } = await this.loadPdf(path);
    const output = await this.splitter.createDocuments([text]);
    const pineconeIndex = this.vectorStore.getIndex();

    await PineconeStore.fromDocuments(
      output,
      new OpenAIEmbeddings({ openAIApiKey }),
      {
        pineconeIndex,
        maxConcurrency: 5, // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
      },
    );
  }
}
