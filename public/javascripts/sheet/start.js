
require([
    'sheet/unit/definitions',
    'sheet/unit/sheet',
    'sheet/WidgetManager',
    'sheet/widgets/Text',
    'sheet/perspective/list/List'], function(a, b, WidgetManager, Text, List){

    test('widget manager', function(){

        ok(WidgetManager)

        expect(1)

        WidgetManager.preloadWidgets([
            'sheet/widgets/Header',
            'sheet/widgets/Text'
        ]).then(function(){

            var types = WidgetManager.knownTypes();
            equals(types[0], 'header')
            equals(types[1], 'text')

            var text_widget = WidgetManager.createWidget({
                wtype : 'text'
            })

            ok(typeOf(text_widget, Text))

        });

    })

    test('list persp', function(){

        ok(List)

        list = new List();

        expect(1)

        list.ready.then(function(){
            list.sheet.inject(document.getElement('body'))
            list.sheet.render()
        })

    })

})



