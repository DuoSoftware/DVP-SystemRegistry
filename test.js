/**
 * Created by a on 5/19/2015.
 */
var dbModel = require('DVP-DBModels');


dbModel.Template
    .find({where: {Name: "DBTEMPLATE"}, include: [{model: dbModel.Image, as: "TemplateImage"}]})
    .complete(function (err, data){

        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(data);



        }
    });


var image = dbModel.Image.build({


    Name: "pgsql",
    Description: "Database",
    Version: "6.0",
    VersionStatus: "Stable",
    SourceUrl: undefined,
    DockerUrl: "library/postgres",
    Class: "DOCKER",
    Type: "EXTERNAL",
    Category: "DATABASE",
    Importance: "NONE",
    Cmd: "postgres"


});



var template = dbModel.Template.build({


    Name: "DBTEMPLATE",
    Description: "ONLYPGSQL",
    Class: "CONTACT",
    Type: "EXTERNAL",
    Category: "SYSTEM",
    CompanyId: 1,
    TenantId: 3


});



template
    .save()
    .complete(function (err) {
        try {

                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log("Done");

                    image
                        .save()
                        .complete(function (err) {
                            try {

                                if(err)
                                {
                                    console.log(err);
                                }
                                else
                                {
                                    console.log("Done");

                                    template.addTemplateImage(image, { Type: 'Mandetory', Priority: 1 });

                                }

                            }
                            catch (ex)
                            {
                                console.log(err);
                            }

                        });

                }

        }
        catch (ex)
        {
            console.log(err);
        }

    });

