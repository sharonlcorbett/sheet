
define(
    [
        'sheet/Perspective',
        'sheet/Sheet',
        'sheet/Definition',
        'sheet/WidgetManager',
        'sheet/components/CellGrid',
        'sheet/components/HeaderPanel',
        'sheet/perspective/list/Entry'
    ],
    function(
        Perspective,
        Sheet,
        Definition,
        WidgetManager,
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
                            wtype : 'text'
                        },
                        dataIndex : 'text'
                    }
                ],
                rows : []
            }
        },

        sheet : null,

        ready : null,

        initialize : function(options){

            var me = this;
            me.parent(options);

            this.ready = jQuery.Deferred();

            WidgetManager.preloadWidgets([
                'sheet/widgets/Header',
                'sheet/widgets/Text'
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

        createEntry : function(def){

            return new Entry(def)
        },

        addEntry : function(entry){

            var row = this.sheet.addRow();
            Object.each(row.dataProjection(), function(field, dataIndex){

                entry[dataIndex].field.connect(field);
            })
        },

        addTextEntry : function(text){

            var entry = this.createEntry({text : text});
            this.addEntry(entry);
        }
    });

    return List;

});