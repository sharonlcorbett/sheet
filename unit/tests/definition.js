
define([
    'platform/base/Definition', 
    'platform/base/Field', 
    'platform/base/CollectionField'
], function(
    Definition,
    Field,
    CollectionField){

    return {
        
         "simple definition test": function(test){
    
            var def = new Definition();
    
            test.ok(def.setup);
            test.ok(def.setupIf);
            
            test.done();
        },
    
         "field test": function(test){
    
            var def = new Definition();
    
            test.ok(typeof def.value == "undefined");
    
            def.addField({
                name : "value"
            });
    
            test.ok(def.value);
            test.ok(def.value.field);
            test.ok(def.fields.value);
            test.ok(instanceOf(def.value.field, Field));
    
            def.addFields([
                {
                    name: "value1"
                },
                {
                    name: "value2"
                }
            ]);
    
            test.ok(def.value1);
            test.ok(def.value2);
            
            test.done();
        },
    
        "field set value test": function(test){
    
            var def = new Definition();
            def.addField({
                name : "value"
            });
    
            test.ok(typeof def.value() == "undefined");
    
            def.value("test");
            test.equal(def.value(), "test");
    
            def.value("");
            test.equal(def.value(), "");
    
            def.value(1);
            test.equal(def.value(), 1);
    
            test.done();
        },
    
        "field default value test": function(test){
    
            var def = new Definition();
            def.addField({
                name : "value",
                defaultValue : "test"
            });
    
            test.ok(typeof def.value() != "undefined");
            test.equal(def.value(), "test");
    
            def.value("something else");
            test.equal(def.value(), "something else");
    
            def.value.field.setToDefault();
            test.equal(def.value(), "test");
            
            test.done();
        },
    
        "field emptyGetter test": function(test){
    
            var def = new Definition();
            def.addField({
                name : "value",
                emptyGetter : function(){
                    return "test";
                }
            });
    
            test.ok(typeof def.value() != "undefined");
            test.equal(def.value(), "test");
            test.ok(def.value.field.value === undefined);
    
            def.value("something else");
            test.equal(def.value(), "something else");
    
            def.value.field.removeValue();
            test.equal(def.value(), "test");
            test.ok(def.value.field.value === undefined);
    
            def.value("something else");
            test.equal(def.value(), "something else");
    
            def.value(undefined);
            test.equal(def.value(), "test");
            test.ok(def.value.field.value === undefined);
            
            test.done();
        },
    
        "field constructor test": function(test){
    
            var def = new Definition();
            def.addField({
                name : "value",
                valueConstructor : function(value){
                    return value + 12;
                }
            });
    
            test.equal(typeof def.value(), "undefined");
            test.ok(def.value.field.value === undefined);
    
            def.value(18);
            test.equal(def.value(), 30);
            test.equal(def.value.field.value, 30);
    
            def.value.field.removeValue();
            test.equal(typeof def.value(), "undefined");
            test.ok(def.value.field.value === undefined);
    
            def.value(19);
            test.equal(def.value(), 31);
            test.equal(def.value.field.value, 31);
    
            def.value(18);
            test.equal(def.value(), 30);
            test.equal(def.value.field.value, 30);
    
            def.value(undefined);
            test.equal(def.value(), undefined);
            test.equal(def.value.field.value, undefined);
            
            test.done();
        },
    
        "field constructor and default value together test": function(test){
    
            var def = new Definition();
            def.addField({
                name : "value",
                valueConstructor : function(value){
                    return value + 12;
                },
                defaultValue : 18
            });
    
            test.equal(def.value(), 30);
            test.ok(def.value.field.value === undefined);
    
            def.value(19);
            test.equal(def.value(), 31);
            test.equal(def.value.field.value, 31);
    
            def.value.field.removeValue();
            test.equal(def.value(), 30);
            test.ok(def.value.field.value === undefined);
    
            def.value(19);
            test.equal(def.value(), 31);
            test.equal(def.value.field.value, 31);
            
            test.done();
    
        },
    
        "field fixed test": function(test){
    
            var def = new Definition();
            def.addField({
                name : "value",
                fixed: true
            });
    
            def.value(10);
            test.equal(def.value(), 10);
    
            def.value(19);
            test.equal(def.value(), 10);
            
            test.done();
    
        },
    
        "field fixed + default test": function(test){
    
            var def = new Definition();
            def.addField({
                name : "value",
                fixed: true,
                defaultValue : 10
            });
    
            def.value(15);
            test.equal(def.value(), 15);
    
            def.value(19);
            test.equal(def.value(), 15);
            
            test.done();
    
        },
    
        "field connection PRIMARY test": function(test){
    
            var def1 = new Definition();
    
            test.expect(5);
    
            def1.addField({
                name : "value"
            });
    
            var def2 = new Definition();
            def2.addField({
                name : "value"
            });
    
            def1.value.field.connect({type:"PRIMARY"}, def2.value.field);
    
            def1.value("test");
            test.equals(def1.value(), "test");
    
            def2.value("test2");
            test.equals(def1.value(), "test2");
    
            test.equals(def2.value.field.value, "test2");
            test.equals(def1.value.field.value, undefined);
    
            def1.watchFields({
                value : {
                    changed: function(value){
                        test.equals(value, "test3");
                        test.done();
                    }
                }
            });
    
            def2.value("test3");
    
        },
    
        "field freeze test": function(test){
    
            var def = new Definition();
            def.addField({
                name : "value"
            });
    
            def.value(15);
            test.equal(def.value(), 15);
    
            def.value(17);
            test.equal(def.value(), 17);
    
            def.value.field.freeze();
    
            def.value(20);
            test.equal(def.value(), 17);
    
            def.value.field.unFreeze();
    
            def.value(20);
            test.equal(def.value(), 20);
            
            test.done();
    
        },
    
        "def json test": function(test){
    
            var def = new Definition();
            def.addField({
                name : "value"
            });
    
            var j = def.asJSON();
    
            test.ok(j);
            test.ok(!j.value);
    
            def.value("test");
            test.equal(def.asJSON().value, "test");
    
            def.value(undefined);
            test.ok(!def.asJSON().value);
            
            test.done();
    
        },
    
        "def json defaults test": function(test){
    
            var def = new Definition();
            def.addField({
                name : "value",
                defaultValue : "test"
            });
    
            var j = def.asJSON();
    
            test.ok(j);
            test.equal(def.value(), "test");
            test.ok(!j.value);
            
            test.done();
    
        },
    
        "def json call asJSON": function(test){
    
            var def = new Definition();
            def.addField({
                name : "value"
            });
    
            def.value({
                asJSON : function(){
                    return "test";
                }
            });
    
            var j = def.asJSON();
    
            test.ok(j);
            test.notEqual(def.value(), "test");
            test.equal(j.value, "test");
            
            test.done();
    
        },
    
        "def setup": function(test){
    
            var def = new Definition();
            def.addField({
                name : "value"
            });
    
            def.setup({
                value : "test"
            });
    
            test.equal(def.value(), "test");
    
            def.setupIf({
                value : "test2"
            });
    
            test.equal(def.value(), "test");
            
            test.done();
    
        },
    
        "def watch test": function(test){
    
            test.expect(2);
    
            var def = new Definition();
            def.addField({
                name : "value"
            });
    
            def.watchFields({
                value : {
                    changed : function(value, field){
                        test.equals(def.value.field, field);
                        test.equals(value, "test");
                        test.done();
                    }
                }
            });
    
            def.setup({
                value : "test"
            });
    
        },
    
        "def collection test": function(test){
    
            var def = new Definition();
            def.addField({
                name : "items",
                alias : "fields.collection"
            });
    
            test.ok(instanceOf(def.items.field, CollectionField));
            
            test.done();
    
        },
        
        "def collection constructor test": function(test){
    
            var def = new Definition();
            def.addField({
                name : "items",
                alias : "fields.collection",
                collectionConstructor: function(elements){
                    return elements.map(function(item){
                        return item*2;
                    });
                }
            });
    
            def.setup({
                items : [1,2,3]
            });
    
            test.equal(def.items.field.count(), 3);
    
            test.equal(def.items.field.getAt(0), 2);
            test.equal(def.items.field.getAt(1), 4);
            test.equal(def.items.field.getAt(2), 6);
            
            test.done();
    
        },
    
        "def element constructor test": function(test){
    
            var def = new Definition();
            def.addField({
                name : "items",
                alias : "fields.collection",
                elementConstructor: function(element){
                    return element*2;
                }
            });
    
            def.setup({
                items : [1,2,3]
            });
    
            test.equal(def.items.field.count(), 3);
    
            test.equal(def.items.field.getAt(0), 2);
            test.equal(def.items.field.getAt(1), 4);
            test.equal(def.items.field.getAt(2), 6);
            
            test.done();
    
        },
    
        "def add element test": function(test){
    
            var def = new Definition();
            def.addField({
                name : "items",
                alias : "fields.collection",
                elementConstructor: function(element){
                    return element*2;
                }
            });
    
            def.setup({
                items : [1,2,3]
            });
    
            def.items.field.addElement(4);
            test.equal(def.items.field.getAt(3), 8);
            
            test.done();
        },
    
        "def remove element test": function(test){
    
            var def = new Definition();
            def.addField({
                name : "items",
                alias : "fields.collection",
                elementConstructor: function(element){
                    return element*2;
                }
            });
    
            def.setup({
                items : [1,2,3]
            });
    
            def.items.field.removeElement(4);
            test.equal(def.items.field.getAt(1), 6);
            
            test.done();
        },
    
        "def collection events watch test": function(test){
    
            var def = new Definition();
            def.addField({
                name : "items",
                alias : "fields.collection",
                elementConstructor: function(element){
                    return element*2;
                }
            });
    
            def.setup({
                items : [1,2,3]
            });
    
            test.expect(4);
    
            def.watchFields({
                items : {
                    elementAdded : function(el, field){
                        test.ok(typeOf(field), CollectionField);
                        test.equals(el, "8");
                    },
                    elementRemoved : function(el, field){
                        test.ok(typeOf(field), CollectionField);
                        test.equals(el, "8");
                        test.done();
                    }
                }
            });
    
            def.items.field.addElement(4);
            def.items.field.removeElement(8);
    
        },
    
        "def element json test": function(test){
    
            var def = new Definition();
            def.addField({
                name : "items",
                alias : "fields.collection",
                elementConstructor: function(element){
                    return element*2;
                }
            });
    
            def.setup({
                items : [1,2,3]
            });
    
            var j = def.asJSON();
    
            test.equal(j.items.length, 3);
    
            test.equal(j.items[0], 2);
            test.equal(j.items[1], 4);
            test.equal(j.items[2], 6);
            
            test.done();
    
        },
    
        "def element asJSON test": function(test){
    
            var def = new Definition();
            def.addField({
                name : "items",
                alias : "fields.collection",
                elementConstructor: function(element){
                    return {
                        asJSON : function(){
                            return element*2;
                        }
                    };
                }
            });
    
            def.setup({
                items : [1,2,3]
            });
    
            test.equal(def.items.field.count(), 3);
    
            test.notEqual(def.items.field.getAt(0), 2);
            test.notEqual(def.items.field.getAt(1), 4);
            test.notEqual(def.items.field.getAt(2), 6);
    
            var j = def.asJSON();
    
            test.equal(j.items.length, 3);
    
            test.equal(j.items[0], 2);
            test.equal(j.items[1], 4);
            test.equal(j.items[2], 6);
            
            test.done();
    
        },
    
        "def element each test": function(test){
    
            var def = new Definition();
            def.addField({
                name : "items",
                alias : "fields.collection",
                property : true
            });
    
            def.setup({
                items : [0,1,2]
            });
    
            test.expect(3);
    
            def.items.each(function(value, index){
                test.equals(value, index);
            });
            
            test.done();    
        }
    
    };

});

