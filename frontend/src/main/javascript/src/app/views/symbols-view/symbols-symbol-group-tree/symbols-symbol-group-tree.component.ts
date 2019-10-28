import { remove } from 'lodash';
import { AlphabetSymbol } from '../../../entities/alphabet-symbol';
import { SymbolGroup } from '../../../entities/symbol-group';
import { PromptService } from '../../../services/prompt.service';
import { SymbolGroupApiService } from '../../../services/api/symbol-group-api.service';
import { ToastService } from '../../../services/toast.service';
import { SymbolApiService } from '../../../services/api/symbol-api.service';
import { EventBus } from '../../../services/eventbus.service';
import { Selectable } from '../../../utils/selectable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditSymbolGroupModalComponent } from '../edit-symbol-group-modal/edit-symbol-group-modal.component';
import { MoveSymbolGroupModalComponent } from '../move-symbol-group-modal/move-symbol-group-modal.component';
import { EditSymbolModalComponent } from '../edit-symbol-modal/edit-symbol-modal.component';
import { MoveSymbolsModalComponent } from '../move-symbols-modal/move-symbols-modal.component';
import { SymbolUsagesModalComponent } from '../../../common/modals/symbol-usages-modal/symbol-usages-modal.component';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'symbols-symbol-group-tree',
  templateUrl: './symbols-symbol-group-tree.component.html',
  styleUrls: ['./symbols-symbol-group-tree.component.scss']
})
export class SymbolsSymbolGroupTreeComponent implements OnInit {

  @Input()
  public selectedSymbols: Selectable<AlphabetSymbol>;

  @Input()
  public symbols: AlphabetSymbol[];

  @Input()
  public level: any;

  /** The symbol group to display. */
  @Input()
  public group: SymbolGroup;

  /** If the group is collapsed. */
  public collapse: boolean;

  constructor(private promptService: PromptService,
              private symbolGroupApi: SymbolGroupApiService,
              private toastService: ToastService,
              private symbolApi: SymbolApiService,
              private eventBus: EventBus,
              private modal: NgbModal,
              private modalService: NgbModal) {
    this.collapse = false;
  }

  ngOnInit(): void {
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
        this.symbolGroupApi.remove(this.group).subscribe(
          () => {
            this.toastService.success(`Group <strong>${this.group.name}</strong> deleted`);
            this.eventBus.groupDeleted$.next(this.group);
          },
          err => {
            this.toastService.danger(`The group could not be deleted. ${err.data.message}`);
          }
        );
      });
  }

  /**
   * Opens the modal dialog for moving a group.
   */
  moveGroup(): void {
    const modalRef = this.modalService.open(MoveSymbolGroupModalComponent);
    modalRef.componentInstance.group = this.group.copy();
  }

  editGroup(): void {
    const modalRef = this.modalService.open(EditSymbolGroupModalComponent);
    modalRef.componentInstance.group = this.group.copy();
  }

  showUsages(symbol: AlphabetSymbol): void {
    const modalRef = this.modalService.open(SymbolUsagesModalComponent);
    modalRef.componentInstance.symbol = symbol;
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

        this.symbolApi.export(symbol.project, {symbolIds: [symbol.id], symbolsOnly: true}).subscribe(
          body => {
            const symbolToCreate = body.symbols[0];
            symbolToCreate.name = name;
            symbolToCreate.group = symbol.group;

            // first create the symbol without actions
            return this.symbolApi.create(symbol.project, symbolToCreate).subscribe(
              createdSymbol => {
                this.group.symbols.push(createdSymbol);
                this.symbols.push(createdSymbol);
                this.toastService.success('The symbol has been copied.');
              }
            );
          },
          err => this.toastService.danger(`The symbol could not be created. ${err.data.message}`)
        );
      });
  }

  /**
   * Deletes a single symbol from the server and from the scope if the deletion was successful.
   *
   * @param symbol The symbol to be deleted.
   */
  deleteSymbol(symbol: AlphabetSymbol): void {
    this.symbolApi.remove(symbol).subscribe(
      () => {
        this.toastService.success('Symbol <strong>' + symbol.name + '</strong> deleted');
        remove(this.group.symbols, {id: symbol.id});
        this.selectedSymbols.unselect(symbol);
      },
      err => {
        this.toastService.danger(`The symbol could not be deleted. ${err.data.message}`);
      }
    );
  }

  openSymbolEditModal(symbol: AlphabetSymbol): void {
    const modalRef = this.modalService.open(EditSymbolModalComponent);
    modalRef.componentInstance.symbol = new AlphabetSymbol(JSON.parse(JSON.stringify(symbol)));
  }

  openSymbolsMoveModal(symbols: AlphabetSymbol[]): void {
    const modalRef = this.modalService.open(MoveSymbolsModalComponent);
    modalRef.componentInstance.symbols = symbols;
  }
}
