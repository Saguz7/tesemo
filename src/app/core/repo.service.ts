import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { FetchResult } from 'apollo-link';
import findIndex from 'core-js/library/fn/array/find-index';

import { Observable } from 'rxjs';

import * as Q from '../graphql/queries';
import * as M from '../graphql/mutations';
import { DataProxy } from 'apollo-cache';

interface IUpdateTopicsInput {
  repositoryId: string;
  topicNames: string[];
  clientMutationId: string;
}

@Injectable()
export class RepoService {
  repoQuery: QueryRef<any>;

  constructor(private apollo: Apollo) {}

  private repoQueryVariables: any;

  public getRepoes(login: string, first: number): Observable<any> {
    this.repoQuery = this.apollo.watchQuery<any>({
      query: Q.REPOES,
      variables: {
        login,
        first
      }
    });
    return this.repoQuery.valueChanges.map(res => {
      const { data, ...rest } = res;
      return {
        repoes: data.user.repositories,
        ...rest
      };
    });
  }

  public getRepoesMore(login: string, first: number, after: string): Promise<any> {
    return this.repoQuery.fetchMore({
      variables: {
        login,
        first,
        after
      },
      updateQuery: (previousQueryResult, { fetchMoreResult, variables }) => {
        if (!fetchMoreResult) {
          return previousQueryResult;
        }
        const prevEdges = previousQueryResult.user.repositories.edges;
        const edges = fetchMoreResult.user.repositories.edges;
        const nextEdges = [...prevEdges, ...edges];

        const nextResult = Object.assign({}, previousQueryResult, {
          user: Object.assign({}, previousQueryResult.user, {
            repositories: Object.assign({}, previousQueryResult.user.repositories, {
              edges: nextEdges
            })
          })
        });

        return nextResult;
      }
    });
  }

  public getTopics(owner: string, name: string, first?: number): Observable<any> {
    this.repoQueryVariables = {
      owner,
      name,
      first
    };
    return this.apollo
      .watchQuery<any>({
        query: Q.TOPICS,
        variables: this.repoQueryVariables
      })
      .valueChanges.map((res: any) => {
        const { data, ...rest } = res;
        return { repository: data.repository, ...rest };
      });
  }

  public prefetchTopics(owner: string, name: string, first?: number) {
    this.apollo.query({ query: Q.TOPICS, variables: { owner, name, first } }).subscribe();
  }

  public updateTopics(updateTopicsInput: IUpdateTopicsInput): Observable<any> {
    return this.apollo.mutate<any>({
      mutation: M.UPDATE_TOPICS,
      variables: {
        input: updateTopicsInput
      },
      update: (proxy: DataProxy, mutationResult: FetchResult<any>) => {
        const {
          data: { updateTopics }
        } = mutationResult;
        if (!updateTopics.invalidTopicNames) {
          let nextNodes: any[];
          const data: any = proxy.readQuery({ query: Q.TOPICS, variables: this.repoQueryVariables });
          // console.log('updateTopicsInput.topicNames: ', updateTopicsInput.topicNames);

          const {
            repository: { repositoryTopics }
          } = data;

          if (repositoryTopics.nodes.length > updateTopicsInput.topicNames.length) {
            nextNodes = repositoryTopics.nodes
              .map(node => {
                if (updateTopicsInput.topicNames.indexOf(node.topic.name) !== -1) {
                  return node;
                }
              })
              .filter(x => x);
          } else {
            nextNodes = updateTopicsInput.topicNames.map((topicName: string) => {
              const idx: number = findIndex(repositoryTopics.nodes, node => node.topic.name === topicName);
              const exist: boolean = idx !== -1;
              if (exist) {
                return repositoryTopics.nodes[idx];
              } else {
                return {
                  id: Math.random().toString(),
                  topic: {
                    id: Math.random().toString(),
                    name: topicName,
                    __typename: 'Topic'
                  },
                  __typename: 'RepositoryTopic'
                };
              }
            });
          }

          // console.log('nextNodes: ', nextNodes);

          repositoryTopics.nodes = nextNodes;

          proxy.writeQuery({ query: Q.TOPICS, variables: this.repoQueryVariables, data });
        }
      }
    });
  }
}
