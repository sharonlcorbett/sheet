/**
 * Фабрика классов Cell, отражающих отдельную ячейку в таблице. Класс описывает ее поведение
 * и внешний вид, ответственен за все операции и события, происходящие
 * с ячейкой.
 *
 * @param settings
 */
define(
    [
        'platform/base/WidgetComponent'
    ],
    function(
        WidgetComponent
    ){

    var Cell = new Class({

        Extends : WidgetComponent,

        options : {

            elementTag: 'td'
        },

        column : null,

        row : null,

        initialize       : function(definition, options){

            this.addFields([
                {
                    name : 'editable',
                    emptyGetter : function(){
                        return this.column.editable();
                    }.bind(this)
                },
                {
                    name : 'format'
                },
                {
                    name: 'value',
                    emptyGetter : function(){
                        return this.column.defaultValue();
                    }.bind(this)
                },
                {
                    name : 'widget',
                    emptyGetter : function(){
                        return this.column.defaultWidget();
                    }.bind(this)
                }
            ]);

            this.parent(options);
            this.setup(definition);
        },

        rowIdx : function(){

            return this.row.idx;
        },

        colIdx : function(){

            return this.column.idx;
        },

        render : function(){

            this.widget().value = this.value();
            this.widget().render();
        },

        inject: function(){

            this.parent.apply(this, arguments);

            var me = this;

            me.render();

            this.watchFields({
                value : {
                    changed : function(value){
                        me.widget().value = value
                        me.render();
                    }
                }
            })
        }
    })

    return Cell;

})