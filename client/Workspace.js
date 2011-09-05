
define(
    [
        'platform/base/Component',
        'platform/components/CellGrid',
        'platform/components/HeaderPanel'
    ],
    function(
        Component,
        CellGrid,
        HeaderPanel
    ){

    var Workspace = new Class({

        Extends : Component,

        headerPanel : null,
        toolbar : null,
        gridPanel : null,
        navibar : null,

        options : {

            elementTemplate: function(){

                div({class: 'xx-sheet'},
                    div({class: 'xx-header'}),
                    div({class: 'xx-toolbar'}),
                    div({class: 'xx-grid'}),
                    div({class: 'xx-navibar'})
                )
            }
        },

        initialize : function(options){

            this.headerPanel = new HeaderPanel()
            //this.toolbar = new HeaderPanel()
            this.gridPanel = new CellGrid()
            //this.navibar = new HeaderPanel()

            this.parent(options);
        },

        inject : function(){

            this.parent.apply(this, arguments);
            this.headerPanel.inject(this.view.getElement('.xx-header'))
            this.gridPanel  .inject(this.view.getElement('.xx-grid'))
        },

        loadPerspective : function(perspective){

        },

        loadSheet : function(sheet){

            this.headerPanel.loadSheet(sheet);
            this.gridPanel.loadSheet(sheet);

            sheet.fn.resize.resizeColumns();
        }

    })

    return Workspace

})