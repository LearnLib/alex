import Action from '../Action';

/** Executes another symbol before continuing with other actions */
class ExecuteSymbolGeneralAction extends Action {
    static get type() {
        return 'executeSymbol';
    }

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     */
    constructor(obj) {
        super(ExecuteSymbolGeneralAction.type);

        /**
         * idRevisionPair
         * @type {*|{id: null, revision: null}}
         */
        this.symbolToExecute = obj.idRevisionPair || {id: null, revision: null};

        let _symbol = {
            name: obj.symbolName || '',
            revision: null
        };

        this.getSymbol = function () {
            return _symbol;
        };

        this.setSymbol = function (symbols) {
            let symbol;

            symbols.forEach(s => {
                if (s.name === _symbol.name) symbol = s;
            });

            if (symbol) {
                this.symbolToExecute = {
                    id: symbol.id,
                    revision: symbol.revision
                };
                _symbol.name = symbol.name;
                _symbol.revision = symbol.revision;
            }
        }
    }

    /**
     * @param {string} key - The property to set
     * @param {any} value - The value to set
     */
    set(key, value) {
        if (key === 'symbolToExecuteName') {
            this.getSymbol().name = value;
        } else {
            if (key === 'symbolToExecute') {
                this.getSymbol().revision = value.revision;
            }
            this[key] = value;
        }
    }

    /**
     * A string presentation of the actions
     * @returns {string}
     */
    toString() {
        return 'Execute symbol "' + this.getSymbol().name + '", rev. ' + this.symbolToExecute.revision;
    }
}

export default ExecuteSymbolGeneralAction;