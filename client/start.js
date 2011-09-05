
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

            modelClass : {
                alias : 'models.entry'
            },

            columns : [
                {
                    value : "Привет",
                    dataIndex: "text"
                },
                {
                    value : "Пока"
                }
            ]

        });

        w.loadSheet(sheet)

    })


})



