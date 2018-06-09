import { Injectable } from '@angular/core';
import { ITaskSpecification } from '../../models/task-specification';
import { Buffer } from 'buffer';

import IPFS from 'ipfs';

@Injectable({
  providedIn: 'root'
})
export class IpfsNetworkService {

  private ipfs: IPFS;

  constructor() {
    const options = {
      config: {
        Addresses: {
          Swarm: [
            '/ip4/127.0.0.1/tcp/4003/ws/ipfs/QmXeGoXuCuirE9NNJjhfovq76eJ7iT7EaJVUQWpDhV9AMY',
            '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
          ]
        }
      }
    };

    this.ipfs = new IPFS(options);
  }

  async init() {
    return new Promise((res, rej) => {
      this.ipfs.on('ready', () => res());
      this.ipfs.on('error', err => rej(err));
    });
  }

  async addTaskData(spec: ITaskSpecification) {
    return (await this.ipfs.files.add({
      path: `/task-spec-${Math.random()}`,
      content: Buffer.from(JSON.stringify(spec))
    }))[0];
  }

  async getTaskData(hash): Promise<ITaskSpecification> {
    return JSON.parse((await this.ipfs.files.cat(hash)).toString());
  }
}
