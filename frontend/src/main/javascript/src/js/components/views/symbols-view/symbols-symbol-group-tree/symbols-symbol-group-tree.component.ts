import * as remove from 'lodash/remove';
import {events} from '../../../../constants';
import {AlphabetSymbol} from '../../../../entities/alphabet-symbol';
import {SymbolGroup} from '../../../../entities/symbol-group';
import {PromptService} from '../../../../services/prompt.service';
import {SymbolGroupResource} from '../../../../services/resources/symbol-group-resource.service';
import {ToastService} from '../../../../services/toast.service';
import {SymbolResource} from '../../../../services/resources/symbol-resource.service';
import {EventBus} from '../../../../services/eventbus.service';
import {Selectable} from '../../../../utils/selectable';

export const symbolsSymbolGroupTreeComponent = {
  template: require('./symbols-symbol-group-tree.component.html'),
  bindings: {
    group: '=',
    selectedSymbols: '=',
    symbols: '=',
    level: '@'
  },
  controllerAs: 'vm',
  controller: class SymbolsSymbolGroupTreeComponent {

    public selectedSymbols: Selectable<AlphabetSymbol>;

    public symbols: AlphabetSymbol[];

    public level: any;

    /** The symbol group to display. */
    public group: SymbolGroup;

    /** If the group is collapsed. */
    public collapse: boolean;

    /**
     * Constructor.
     *
     * @param promptService
     * @param symbolGroupResource
     * @param toastService
     * @param symbolResource
     * @param eventBus
     * @param $uibModal
     */
    /* @ngInject */
    constructor(private promptService: PromptService,
                private symbolGroupResource: SymbolGroupResource,
                private toastService: ToastService,
                private symbolResource: SymbolResource,
                private eventBus: EventBus,
                private $uibModal: any) {

      this.group = null;
      this.collapse = false;
    }

    $onInit(): void {
      this.level = this.level == null ? 0 : parseInt(this.level);
      if (this.level > 0) {
        this.collapse = true;
      }
    }

    /**
     * Deletes the symbol group under edit and closes the modal dialog on success.
     */
    deleteGroup(): void {
      this.promptService.confirm('Are you sure that you want to delete the group? All symbols will be archived.')
        .then(() => {
          this.symbolGroupResource.remove(this.group)
            .then(() => {
              this.toastService.success(`Group <strong>${this.group.name}</strong> deleted`);
              this.eventBus.emit(events.GROUP_DELETED, {
                group: this.group
              });
            })
            .catch(err => {
              this.toastService.danger(`The group could not be deleted. ${err.data.message}`);
            });
        });
    }

    /**
     * Opens the modal dialog for moving a group.
     */
    moveGroup(): void {
      this.$uibModal.open({
        component: 'symbolGroupMoveModal',
        resolve: {
          group: () => new SymbolGroup(JSON.parse(JSON.stringify(this.group)))
        }
      });
    }

    editGroup(): void {
      this.$uibModal.open({
        component: 'symbolGroupEditModal',
        resolve: {
          group: () => new SymbolGroup(JSON.parse(JSON.stringify(this.group)))
        }
      });
    }

    showUsages(symbol: AlphabetSymbol): void {
      this.$uibModal.open({
        component: 'symbolUsagesModal',
        resolve: {
          symbol: () => symbol
        }
      });
    }

    /**
     * Copy a symbol.
     *
     * @param symbol The symbol to copy.
     */
    copySymbol(symbol: AlphabetSymbol): void {
      const newName = symbol.name + ' - Copy';
      this.promptService.prompt('Enter a name for the new symbol', newName)
        .then(name => {
          const symbolToCreate = symbol.getExportableSymbol();
          symbolToCreate.name = name;
          symbolToCreate.group = symbol.group;

          // first create the symbol without actions
          this.symbolResource.create(symbol.project, symbolToCreate)
            .then(createdSymbol => {
              this.group.symbols.push(createdSymbol);
              this.symbols.push(createdSymbol);
              this.toastService.success('The symbol has been copied.');
            })
            .catch(err => this.toastService.danger(`The symbol could not be created. ${err.data.message}`));
        });
    }

    /**
     * Deletes a single symbol from the server and from the scope if the deletion was successful.
     *
     * @param symbol The symbol to be deleted.
     */
    deleteSymbol(symbol: AlphabetSymbol): void {
      this.symbolResource.remove(symbol)
        .then(() => {
          this.toastService.success('Symbol <strong>' + symbol.name + '</strong> deleted');
          remove(this.group.symbols, {id: symbol.id});
          this.selectedSymbols.unselect(symbol);
        })
        .catch(err => {
          this.toastService.danger(`The symbol could not be deleted. ${err.data.message}`);
        });
    }

    openSymbolEditModal(symbol: AlphabetSymbol): void {
      this.$uibModal.open({
        component: 'symbolEditModal',
        resolve: {
          symbol: () => new AlphabetSymbol(JSON.parse(JSON.stringify(symbol)))
        }
      });
    }

    openSymbolsMoveModal(symbols: AlphabetSymbol[]): void {
      this.$uibModal.open({
        component: 'symbolMoveModal',
        resolve: {
          symbols: () => symbols
        }
      });
    }
  }
};
