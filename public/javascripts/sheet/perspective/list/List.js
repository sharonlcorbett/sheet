
define(
    [
        'sheet/Perspective',
        'sheet/Sheet',
        'sheet/Definition',
        'sheet/ClassManager',
        'sheet/components/CellGrid',
        'sheet/components/HeaderPanel',
        'sheet/perspective/list/Entry'
    ],
    function(
        Perspective,
        Sheet,
        Definition,
        ClassManager,
        CellGrid,
        HeaderPanel,
        Entry
    ){

    var List = new Class({

        Extends : Perspective,

        Implements : [Options, Events],

        options : {

            sheetDefinition : {

                columns : [
                    {
                        value : "Title",
                        defaultWidget : {
                            alias : 'TextWidget'
                        },
                        dataIndex : 'text'
                    },
                    {
                        value : "Описание",
                        defaultWidget : {
                            alias : 'TextWidget'
                        }
                    }
                ]
            }
        },

        sheet : null,

        ready : null,

        initialize : function(options){

            var me = this;
            me.parent(options);

            this.ready = jQuery.Deferred();

            ClassManager.preload([
                'sheet/widgets/Header',
                'sheet/widgets/Text',
                'sheet/perspective/list/Entry'
            ])
            .then(function(){

                me.createSheet();

                me.ready.resolve();
                me.fireEvent('ready')
            });
        },

        createSheet : function(){

            this.sheet = new Sheet(this.options.sheetDefinition);

            var cmp = [
                new HeaderPanel(this.sheet),
                new CellGrid(this.sheet)
            ]

            this.sheet.components = cmp;
        },

        createEntry : function(text){

            return this.sheet.addRow({
                model : {
                    alias : 'EntryModel',
                    text  : text
                }
            });
        }

    });

    return List;

});