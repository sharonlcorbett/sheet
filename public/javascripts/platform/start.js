
require(
    [
        'unit/definitions',
        'unit/sheet',
        'platform/Workspace',
        'sheet/Sheet',
        'sheet/ClassManager'
    ],
    function(
        a,
        b,
        Workspace,
        Sheet,
        ClassManager
    ){

    test('Workspace', function(){

        ClassManager.preload([
            'platform/widgets/Text',
            'platform/widgets/Header',
            'platform/widgets/CheckBox',
            'platform/perspective/list/Entry'
        ]).then(function(){

                w = new Workspace();
                w.inject(document.getElement('body'));

                sheet = new Sheet({

                    resizeMode : "screen",

                    columns : [
                        {
                            value : "Статус",
                            width : 50,
                            flex  : 0.2,
                            defaultWidget: {
                                alias : "CheckBoxWidget"
                            },
                            defaultValue : false
                        },
                        {
                            value : "Текст",
                            width : 200,
                            flex  : 0.5
                        },
                        {
                            value : "Поясненеие",
                            width : 400,
                            flex  : 2
                        }
                    ],

                    rows : [
                        {
                            cells : [
                                {
                                    value : true
                                },
                                {
                                    value : "Выясненеие статуса заявки"
                                },
                                {
                                    value : "Просто выяснить статус, хуле"
                                }
                            ]
                        }
                    ]
                })

                w.loadSheet(sheet)

            })



    })

})



