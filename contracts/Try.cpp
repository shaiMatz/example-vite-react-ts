#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/print.hpp>

namespace mycontract {
   using namespace std;
   using namespace eosio;

   class [[eosio::contract]] Try : public eosio::contract {
        using eosio::contract::contract;

        public:
            [[eosio::action]] void hi(name user) {
                print("Hi there, ", user.value, "!");
            }
            [[eosio::action]] void hiii(name user) {
                print("Hi there, ", user.value, "!");
            }
   };
}