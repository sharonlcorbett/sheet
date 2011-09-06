define(
    [
        'platform/base/Definition'
    ],
    function(
        Definition
    ){

    var Column = new Class({

        Extends : Definition,
        
        Alias : 'sheet.column',

        options : {

            elementTag: 'th'
        },

        idx : null,

        initialize : function(definition, options){

            this.parent(options);
            
            this.addFields([
                {
                    name : 'flex',
                    defaultValue : 1
                },
                {
                    name : 'removable',
                    defaultValue : true,
                },
                {
                    name : 'resizable',
                    defaultValue : false
                },
                {
                    name : 'orderable',
                    defaultValue : false
                },
                {
                    name : 'editable',
                    defaultValue : false
                },
                {
                    name : 'width',
                    defaultValue : 0
                },
                {
                    name : 'format',
                    defaultValue : null
                },
                {
                    name : 'defaultValue',
                    defaultValue : ''
                },
                {
                    name : 'defaultWidget',
                    defaultValue : {
                        alias : 'widgets.text'
                    }
                },
                {
                    name : 'value',
                    defaultValue : 'Header',
                    defaultValue : "New column"
                },
                {
                    name : 'widget',
                    defaultValue : {
                        alias : 'widgets.header'
                    }
                },
                {
                    name : 'dataIndex'
                }
            ]);

            this.setup(definition);

        }

    });

    return Column;

});