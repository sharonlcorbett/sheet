define(['sheet/definitions/Definition'], function(Definition){

    test("simple definition test", function(){

        var def = new Definition()

        ok(def.setup, "Has setup function")
        ok(def.setupIf, "Has setupIf function")
    })

    test("field test", function(){

        var def = new Definition()

        ok(typeof def.value == "undefined", "Does not have value field")

        def.addField({
            name : "value"
        })

        ok(def.value, "Value field getter/setter created")
        ok(def.value.field, "Getter/Setter property field")
        ok(def.fields["value"], "Fields array has value field")
    })

    test("field set value test", function(){

        var def = new Definition()
        def.addField({
            name : "value"
        })

        ok(typeof def.value() == "undefined", "Value is undefined by default")

        def.value("test")
        equal(def.value(), "test", "Value is now 'test'")

        def.value("")
        equal(def.value(), "", "Value is now ''")

        def.value(1)
        equal(def.value(), 1, "Value is now '1'")

    })

    test("field default value test", function(){

        var def = new Definition()
        def.addField({
            name : "value",
            defaultValue : "test"
        })

        ok(typeof def.value() != "undefined", "Value is not undefined by default")
        equal(def.value(), "test", "Value has default value 'test'")

        def.value("something else");
        equal(def.value(), "something else", "Value has value 'something else")

        def.value.field.setToDefault();
        equal(def.value(), "test", "Value has default value 'test' after setToDefault")
    })

    test("field emptyGetter test", function(){

        var def = new Definition()
        def.addField({
            name : "value",
            emptyGetter : function(){
                return "test"
            }
        })

        ok(typeof def.value() != "undefined", "Value is not undefined by default")
        equal(def.value(), "test", "Value has getter value 'test'")
        ok(def.value.field.value == undefined, "Value field has undefined internal value")

        def.value("something else");
        equal(def.value(), "something else", "Value has value 'something else'")

        def.value.field.removeValue()
        equal(def.value(), "test", "Value has getter value 'test' after removeValue")
        ok(def.value.field.value == undefined, "Value field has undefined internal value")

        def.value("something else");
        equal(def.value(), "something else", "Value has value 'something else")

        def.value(undefined);
        equal(def.value(), "test", "Value has getter value 'test' after setting to undefined")
        ok(def.value.field.value == undefined, "Value field has undefined internal value")
    })

    test("field constructor test", function(){

        var def = new Definition()
        def.addField({
            name : "value",
            valueConstructor : function(value){
                return value + 12
            }
        })

        equal(typeof def.value(), "undefined", "Value field is undefined by default")
        ok(def.value.field.value == undefined, "Value field has undefined internal value")

        def.value(18);
        equal(def.value(), 30, "Value field has constructed value")
        equal(def.value.field.value, 30, "Value field has has constructed value")

        def.value.field.removeValue();
        equal(typeof def.value(), "undefined", "Value field is undefined after removeValue")
        ok(def.value.field.value == undefined, "Value field has undefined after removeValue")

        def.value(19);
        equal(def.value(), 31, "Value field has constructed value")
        equal(def.value.field.value, 31, "Value field has has constructed value")

        def.value(18);
        equal(def.value(), 30, "Value field has constructed value")
        equal(def.value.field.value, 30, "Value field has has constructed value")

        def.value(undefined);
        equal(def.value(), undefined, "Value field has constructed value")
        equal(def.value.field.value, undefined, "Value field has has constructed value")
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

        equal(def.value(), 30, "Value field has constructed default value")
        ok(def.value.field.value == undefined, "Value field has undefined value")

        def.value(19);
        equal(def.value(), 31, "Value field has constructed value")
        equal(def.value.field.value, 31, "Value field has has constructed value")

        def.value.field.removeValue();
        equal(def.value(), 30, "Value field has constructed default value after removeValue")
        ok(def.value.field.value == undefined, "Value field has constructed default value after removeValue")

        def.value(19);
        equal(def.value(), 31, "Value field has constructed value")
        equal(def.value.field.value, 31, "Value field has has constructed value")

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
        equal(def.value(), 10, "Value field has the same value")

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
        equal(def.value(), 15, "Value field has the same value")

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

});

