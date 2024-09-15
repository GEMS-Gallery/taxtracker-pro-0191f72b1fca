import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface TaxPayer {
  'tid' : string,
  'spyShot' : [] | [string],
  'address' : string,
  'lastName' : string,
  'firstName' : string,
}
export interface _SERVICE {
  'addTaxPayer' : ActorMethod<
    [string, string, string, string, [] | [string]],
    undefined
  >,
  'databaseCleanup' : ActorMethod<[], bigint>,
  'deleteTaxPayer' : ActorMethod<[string], boolean>,
  'getAllTaxPayers' : ActorMethod<[], Array<TaxPayer>>,
  'searchTaxPayer' : ActorMethod<[string], [] | [TaxPayer]>,
  'updateTaxPayer' : ActorMethod<
    [string, string, string, string, [] | [string]],
    boolean
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
