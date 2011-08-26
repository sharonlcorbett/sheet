define([
    'sheet/Definition',
    'sheet/helpers/Field',
    'sheet/helpers/CollectionField'], function(Definition,
                                               Field,
                                               CollectionField){

    module("Definition and Field")

    test("simple definition test", function(){

        var def = new Definition()

        ok(def.setup)
        ok(def.setupIf)
    })

    test("field test", function(){

        var def = new Definition()

        ok(typeof def.value == "undefined")

        def.addField({
            name : "value"
        })

        ok(def.value)
        ok(def.value.field)
        ok(def.fields["value"])
        ok(instanceOf(def.value.field, Field))

        def.addFields([
            {
                name: "value1"
            },
            {
                name: "value2"
            }
        ])

        ok(def.value1)
        ok(def.value2)
    })

    test("field set value test", function(){

        var def = new Definition()
        def.addField({
            name : "value"
        })

        ok(typeof def.value() == "undefined")

        def.value("test")
        equal(def.value(), "test")

        def.value("")
        equal(def.value(), "")

        def.value(1)
        equal(def.value(), 1)

    })

    test("field default value test", function(){

        var def = new Definition()
        def.addField({
            name : "value",
            defaultValue : "test"
        })

        ok(typeof def.value() != "undefined")
        equal(def.value(), "test")

        def.value("something else");
        equal(def.value(), "something else")

        def.value.field.setToDefault();
        equal(def.value(), "test")
    })

    test("field emptyGetter test", function(){

        var def = new Definition()
        def.addField({
            name : "value",
            emptyGetter : function(){
                return "test"
            }
        })

        ok(typeof def.value() != "undefined")
        equal(def.value(), "test")
        ok(def.value.field.value == undefined)

        def.value("something else");
        equal(def.value(), "something else")

        def.value.field.removeValue()
        equal(def.value(), "test")
        ok(def.value.field.value == undefined)

        def.value("something else");
        equal(def.value(), "something else")

        def.value(undefined);
        equal(def.value(), "test")
        ok(def.value.field.value == undefined)
    })

    test("field constructor test", function(){

        var def = new Definition()
        def.addField({
            name : "value",
            valueConstructor : function(value){
                return value + 12
            }
        })

        equal(typeof def.value(), "undefined")
        ok(def.value.field.value == undefined)

        def.value(18);
        equal(def.value(), 30)
        equal(def.value.field.value, 30)

        def.value.field.removeValue();
        equal(typeof def.value(), "undefined")
        ok(def.value.field.value == undefined)

        def.value(19);
        equal(def.value(), 31)
        equal(def.value.field.value, 31)

        def.value(18);
        equal(def.value(), 30)
        equal(def.value.field.value, 30)

        def.value(undefined);
        equal(def.value(), undefined)
        equal(def.value.field.value, undefined)
    })

    test("field constructor and default value together test", function(){

        var def = new Definition()
        def.addField({
            name : "value",
            valueConstructor : function(value){
                return value + 12
            },
            defaultValue : 18
        })

        equal(def.value(), 30)
        ok(def.value.field.value == undefined)

        def.value(19);
        equal(def.value(), 31)
        equal(def.value.field.value, 31)

        def.value.field.removeValue();
        equal(def.value(), 30)
        ok(def.value.field.value == undefined)

        def.value(19);
        equal(def.value(), 31)
        equal(def.value.field.value, 31)

    })

    test("field fixed test", function(){

        var def = new Definition()
        def.addField({
            name : "value",
            fixed: true
        })

        def.value(10)
        equal(def.value(), 10)

        def.value(19);
        equal(def.value(), 10)

    })

    test("field fixed + default test", function(){

        var def = new Definition()
        def.addField({
            name : "value",
            fixed: true,
            defaultValue : 10
        })

        def.value(15)
        equal(def.value(), 15)

        def.value(19);
        equal(def.value(), 15)

    })

    test("field freeze test", function(){

        var def = new Definition()
        def.addField({
            name : "value"
        })

        def.value(15)
        equal(def.value(), 15)

        def.value(17)
        equal(def.value(), 17)

        def.value.field.freeze()

        def.value(20)
        equal(def.value(), 17)

        def.value.field.unFreeze()

        def.value(20)
        equal(def.value(), 20)

    })

    test("def json test", function(){

        var def = new Definition()
        def.addField({
            name : "value"
        });

        var j = def.asJSON();

        ok(j);
        ok(!j.value);

        def.value("test");
        equal(def.asJSON().value, "test");

        def.value(undefined);
        ok(!def.asJSON().value);

    })

    test("def json defaults test", function(){

        var def = new Definition()
        def.addField({
            name : "value",
            defaultValue : "test"
        });

        var j = def.asJSON();

        ok(j);
        equal(def.value(), "test")
        ok(!j.value);

    })

    test("def json call asJSON", function(){

        var def = new Definition()
        def.addField({
            name : "value"
        });

        def.value({
            asJSON : function(){
                return "test"
            }
        })

        var j = def.asJSON();

        ok(j);
        notEqual(def.value(), "test")
        equal(j.value, "test");

    })

    test("def setup", function(){

        var def = new Definition()
        def.addField({
            name : "value"
        });

        def.setup({
            value : "test"
        });

        equal(def.value(), "test");

        def.setupIf({
            value : "test2"
        });

        equal(def.value(), "test");

    })

    test("def watch test", function(){

        expect(2);

        var def = new Definition()
        def.addField({
            name : "value"
        });

        def.watchFields({
            value : {
                changed : function(value, field){
                    equals(def.value.field, field)
                    equals(value, "test")
                }
            }
        });

        def.setup({
            value : "test"
        });

    })

    test("def collection test", function(){

        var def = new Definition()
        def.addField({
            name : "items",
            type : "collection"
        });

        ok(instanceOf(def.items.field, CollectionField))

    })

    test("def collection constructor test", function(){

        var def = new Definition()
        def.addField({
            name : "items",
            type : "collection",
            collectionConstructor: function(elements){
                return elements.map(function(item){
                    return item*2
                })
            }
        });

        def.setup({
            items : [1,2,3]
        });

        equal(def.items.field.count(), 3)

        equal(def.items.field.getAt(0), 2)
        equal(def.items.field.getAt(1), 4)
        equal(def.items.field.getAt(2), 6)

    });

    test("def element constructor test", function(){

        var def = new Definition()
        def.addField({
            name : "items",
            type : "collection",
            elementConstructor: function(element){
                return element*2
            }
        });

        def.setup({
            items : [1,2,3]
        });

        equal(def.items.field.count(), 3)

        equal(def.items.field.getAt(0), 2)
        equal(def.items.field.getAt(1), 4)
        equal(def.items.field.getAt(2), 6)

    });

    test("def add element test", function(){

        var def = new Definition()
        def.addField({
            name : "items",
            type : "collection",
            elementConstructor: function(element){
                return element*2
            }
        });

        def.setup({
            items : [1,2,3]
        });

        def.items.field.addElement(4);
        equal(def.items.field.getAt(3), 8)
    });

    test("def remove element test", function(){

        var def = new Definition()
        def.addField({
            name : "items",
            type : "collection",
            elementConstructor: function(element){
                return element*2
            }
        });

        def.setup({
            items : [1,2,3]
        });

        def.items.field.removeElement(4);
        equal(def.items.field.getAt(1), 6)
    });

    test("def collection events watch test", function(){

        var def = new Definition()
        def.addField({
            name : "items",
            type : "collection",
            elementConstructor: function(element){
                return element*2
            }
        });

        def.setup({
            items : [1,2,3]
        });

        expect(4)

        def.watchFields({
            items : {
                elementAdded : function(el, field){
                    ok(typeOf(field), CollectionField)
                    equals(el, "8")
                },
                elementRemoved : function(el, field){
                    ok(typeOf(field), CollectionField)
                    equals(el, "8")
                }
            }
        })

        def.items.field.addElement(4);
        def.items.field.removeElement(8);

    });

    test("def element json test", function(){

        var def = new Definition()
        def.addField({
            name : "items",
            type : "collection",
            elementConstructor: function(element){
                return element*2
            }
        });

        def.setup({
            items : [1,2,3]
        });

        var j = def.asJSON();

        equal(j.items.length, 3)

        equal(j.items[0], 2)
        equal(j.items[1], 4)
        equal(j.items[2], 6)

    });

    test("def element asJSON test", function(){

        var def = new Definition()
        def.addField({
            name : "items",
            type : "collection",
            elementConstructor: function(element){
                return {
                    asJSON : function(){
                        return element*2
                    }
                }
            }
        });

        def.setup({
            items : [1,2,3]
        });

        equal(def.items.field.count(), 3)

        notEqual(def.items.field.getAt(0), 2)
        notEqual(def.items.field.getAt(1), 4)
        notEqual(def.items.field.getAt(2), 6)

        var j = def.asJSON();

        equal(j.items.length, 3)

        equal(j.items[0], 2)
        equal(j.items[1], 4)
        equal(j.items[2], 6)

    });

    test("def element each test", function(){

        var def = new Definition()
        def.addField({
            name : "items",
            type : "collection",
            property : true
        });

        def.setup({
            items : [0,1,2]
        });

        expect(3)

        def.items.each(function(value, index){
            equals(value, index);
        })

    });


});

