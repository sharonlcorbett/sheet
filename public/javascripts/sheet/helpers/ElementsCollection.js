define(function(){

    return function(settings){

        var private_collection = [];

        var getter_setter = function(elements){

            if(_(elements).isArray()){
                //удаляем старые ячейки
                private_collection = [];
                //и добавляем новые
                _(elements).each($.proxy(getter_setter.add, this));
            }
            return private_collection;
        }

        getter_setter.add = function(element){

            if (settings.check && settings.class && !settings.check(element)){
                element = new settings.class(element);
            }
            private_collection.push(element);
            $(getter_setter).trigger("added", [element]);
        }

        getter_setter.remove = function(element){

            private_collection = _(private_collection).without(element);
            $(getter_setter).trigger("removed", [element]);
        }

        return getter_setter;
    }

})