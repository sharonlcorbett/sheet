define(
    [
        'sheet/WidgetComponent'
    ],
    function(
        WidgetComponent
    ){

    var Column = new Class({

        Extends : WidgetComponent,

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
                        alias : 'TextWidget'
                    }
                },
                {
                    name : 'value',
                    defaultValue : 'Header'
                },
                {
                    name : 'widget',
                    defaultValue : {
                        alias : 'HeaderWidget'
                    }
                },
                {
                    name : 'dataIndex'
                }
            ]);

            this.parent(options);
            this.setup(definition);

        },

        applyDefinition: function(def){

            this.initializeWidget();
        },

        render : function(){

            this.widget().value = this.value();
            this.widget().render();
        }

    });

    return Column;

});