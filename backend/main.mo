import Bool "mo:base/Bool";
import Func "mo:base/Func";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";

import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Debug "mo:base/Debug";

actor {
  // Define the TaxPayer type
  public type TaxPayer = {
    tid: Text;
    firstName: Text;
    lastName: Text;
    address: Text;
    spyShot: ?Text;
  };

  // Create a stable variable to store the TaxPayer records
  private stable var taxPayerEntries : [(Text, TaxPayer)] = [];
  private var taxPayers = HashMap.HashMap<Text, TaxPayer>(0, Text.equal, Text.hash);

  // System functions for upgrades
  system func preupgrade() {
    taxPayerEntries := Iter.toArray(taxPayers.entries());
  };

  system func postupgrade() {
    taxPayers := HashMap.fromIter<Text, TaxPayer>(taxPayerEntries.vals(), 1, Text.equal, Text.hash);
  };

  // Helper function to trim spaces
  private func trim(t : Text) : Text {
    Text.trim(t, #char ' ')
  };

  // Function to add a new TaxPayer record
  public func addTaxPayer(tid: Text, firstName: Text, lastName: Text, address: Text, spyShot: ?Text) : async () {
    let newTaxPayer : TaxPayer = {
      tid = trim(tid);
      firstName = trim(firstName);
      lastName = trim(lastName);
      address = trim(address);
      spyShot = spyShot;
    };
    taxPayers.put(trim(tid), newTaxPayer);
    Debug.print("Added new taxpayer: " # debug_show(newTaxPayer));
  };

  // Function to search for a TaxPayer by TID
  public query func searchTaxPayer(tid: Text) : async ?TaxPayer {
    let result = taxPayers.get(trim(tid));
    Debug.print("Searched for taxpayer with TID " # tid # ": " # debug_show(result));
    result
  };

  // Function to get all TaxPayer records
  public query func getAllTaxPayers() : async [TaxPayer] {
    let result = Iter.toArray(taxPayers.vals());
    Debug.print("Retrieved all taxpayers: " # debug_show(result));
    result
  };

  // Function to delete a TaxPayer record
  public func deleteTaxPayer(tid: Text) : async Bool {
    switch (taxPayers.remove(trim(tid))) {
      case null { 
        Debug.print("Failed to delete taxpayer with TID " # tid);
        false 
      };
      case (?_) { 
        Debug.print("Deleted taxpayer with TID " # tid);
        true 
      };
    };
  };

  // Function to update a TaxPayer record
  public func updateTaxPayer(tid: Text, firstName: Text, lastName: Text, address: Text, spyShot: ?Text) : async Bool {
    switch (taxPayers.get(trim(tid))) {
      case null { 
        Debug.print("Failed to update taxpayer with TID " # tid # ": not found");
        false 
      };
      case (?_) {
        let updatedTaxPayer : TaxPayer = {
          tid = trim(tid);
          firstName = trim(firstName);
          lastName = trim(lastName);
          address = trim(address);
          spyShot = spyShot;
        };
        taxPayers.put(trim(tid), updatedTaxPayer);
        Debug.print("Updated taxpayer: " # debug_show(updatedTaxPayer));
        true
      };
    };
  };

  // Function to perform database cleanup
  public func databaseCleanup() : async Nat {
    var deletedCount = 0;
    let entriesToDelete = Array.filter<(Text, TaxPayer)>(
      Iter.toArray(taxPayers.entries()),
      func((tid, _)) { Text.contains(tid, #text " ") }
    );

    for ((tid, _) in entriesToDelete.vals()) {
      taxPayers.delete(tid);
      deletedCount += 1;
    };

    Debug.print("Database cleanup completed. Deleted " # debug_show(deletedCount) # " records.");
    deletedCount
  };
}