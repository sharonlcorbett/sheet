/**
 * Фабрика классов Cell, отражающих отдельную ячейку в таблице. Класс описывает ее поведение
 * и внешний вид, ответственен за все операции и события, происходящие
 * с ячейкой.
 *
 * @param settings
 */
define(
    [
        'platform/base/Definition'
    ],
    function(
        Definition
    ){

    return new Class({

        Extends : Definition,
        
        Alias : 'sheet.cell',

        options : {

            elementTag: 'td'
        },

        column : null,

        row : null,

        initialize       : function(definition, options){
            
            this.parent(options);

            this.addFields([
                {
                    name : 'format'
                },

                /**
                 * Поля с наследуемыми значениями
                 * */
                {
                    name: 'value',
                    emptyGetter : function(){
                        return this.column.defaultValue();
                    }.bind(this)
                },
                {
                    name : 'editable',
                    emptyGetter : function(){
                        return this.column.editable();
                    }.bind(this)
                },
                {
                    name : 'widget',
                    emptyGetter : function(){
                        return this.column.defaultWidget();
                    }.bind(this)
                }
            ]);
            
            this.setup(definition);
        },

        rowIdx : function(){

            return this.row.idx;
        },

        colIdx : function(){

            return this.column.idx;
        }

        /*render : function(){

            this.widget().render();
        },

        initializeWidget: function(){

            this.parent.apply(this, arguments);
            this.widget().value.field.connect({}, this.value.field)
        },

        inject: function(){

            this.parent.apply(this, arguments);
            this.render();
        }*/
    });

});