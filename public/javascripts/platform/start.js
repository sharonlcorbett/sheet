
require(
    [
        'platform/Workspace',
        'platform/sheet/Sheet',

        'platform/widgets/Text',
        'platform/widgets/Header',
        'platform/widgets/CheckBox',
        'platform/perspective/list/Entry',
        'platform/base/List'
    ],
    function(
        Workspace,
        Sheet
    ){

    require([
        'unit/definitions',
        'unit/sheet'
    ])

    test('Workspace', function(){

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
                        alias : "widgets.checkbox"
                    },
                    defaultValue : true
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



