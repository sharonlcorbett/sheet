
require(
    [
        'sheet/unit/definitions',
        'sheet/unit/sheet',
        'sheet/ClassManager',
        'sheet/widgets/Text',
        'sheet/perspective/list/List'
    ],
    function(
        a,
        b,
        ClassManager,
        Text,
        List
    ){

    test('class manager', function(){

        ok(ClassManager)

        expect(1)

        cm = ClassManager

        ClassManager.preload([
            'sheet/widgets/Header',
            'sheet/widgets/Text'
        ]).then(function(){

            var types = ClassManager.known();
            equals(types[0], 'HeaderWidget')
            equals(types[1], 'TextWidget')

            var text_widget = ClassManager.create('TextWidget')

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



