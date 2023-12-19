import {
  PINECONE_API_KEY,
  PINECONE_ENV_NAME,
  PINECONE_INDEX_NAME,
} from '../../env';
import { VectorStore } from '@langchain/core/vectorstores';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { Embeddings } from '@langchain/core/embeddings';

export enum StoreType {
  Pinecone = 'Pinecone',
}

export class StoreBase {
  private readonly vectorStore: VectorStore;
  private readonly pineconeIndex: any;

  constructor(storeType: StoreType, embeddings: Embeddings) {
    if (storeType === StoreType.Pinecone) {
      const pinecone = new Pinecone({
        apiKey: PINECONE_API_KEY,
        environment: PINECONE_ENV_NAME,
      });
      this.pineconeIndex = pinecone.Index(PINECONE_INDEX_NAME);
      this.vectorStore = new PineconeStore(embeddings, {
        pineconeIndex: this.pineconeIndex,
      });
    }
  }

  getStore(): VectorStore {
    return this.vectorStore;
  }

  getIndex(): any {
    return this.pineconeIndex;
  }
}
