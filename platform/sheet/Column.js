define(
    [
        'platform/base/Definition'
    ],
    function(
        Definition
    ){

    var Column = new Class({

        Extends : Definition,

        options : {

            elementTag: 'th'
        },

        idx : null,

        initialize : function(definition, options){

            this.addFields([
                {
                    name : 'flex',
                    defaultValue : 1
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
                    defaultValue : 'Header'
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

            this.parent(options);
            this.setup(definition);

        }

    });

    return Column;

});