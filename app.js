var restify = require('restify');
var config = require('config');
var stringify = require('stringify');
var sysRegBackendHandler = require('./SysRegBackendHandler.js');
var dbModel = require('DVP-DBModels');
var nodeUuid = require('node-uuid');
var logger = require('DVP-Common/LogHandler/CommonLogHandler.js').logger;
var msg = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var sre = require('swagger-restify-express');



var hostIp = config.Host.Ip;
var hostPort = config.Host.Port;
var hostVersion = config.Host.Version;

var server = restify.createServer({
    name: 'localhost',
    version: '1.0.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

/*

server.get('/DVP/API/' + hostVersion + '/SystemRegistry/GetAllServices', function(req, res, next)
{
    var reqId = nodeUuid.v1();
    var serviceRegInfo = {};
    try
    {
        logger.debug('[DVP-SystemRegistry.GetAllServices] - [%s] - HTTP Request Received', reqId);

        sysRegBackendHandler.GetBaseServiceDetails(reqId, function (err, result)
        {
            if (err || !result)
            {
                var jsonString = messageFormatter.FormatMessage(err, "", false, serviceRegInfo);
                logger.debug('[DVP-SystemRegistry.GetAllServices] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);
            }
            else
            {
                serviceRegInfo.BaseServiceInfo = result;

                sysRegBackendHandler.GetExtendedServiceDetails(reqId, function (err, result)
                {
                    if (err || !result)
                    {
                        var jsonString = messageFormatter.FormatMessage(err, "", true, serviceRegInfo);
                        logger.debug('[DVP-SystemRegistry.GetAllServices] - [%s] - API RESPONSE : %s', reqId, jsonString);
                        res.end(jsonString);
                    }
                    else
                    {
                        serviceRegInfo.ExtendedServiceInfo = result;

                        sysRegBackendHandler.GetAttachedServiceDetails(reqId, function (err, result)
                        {
                            if (err || !result)
                            {
                                var jsonString = messageFormatter.FormatMessage(err, "", true, serviceRegInfo);
                                logger.debug('[DVP-SystemRegistry.GetAllServices] - [%s] - API RESPONSE : %s', reqId, jsonString);
                                res.end(jsonString);
                            }
                            else
                            {
                                serviceRegInfo.AttachedServiceInfo = result;

                                var jsonString = messageFormatter.FormatMessage(err, "", true, serviceRegInfo);
                                logger.debug('[DVP-SystemRegistry.GetAllServices] - [%s] - API RESPONSE : %s', reqId, jsonString);
                                res.end(jsonString);
                            }
                        });
                    }
                });
            }
        });
    }
    catch(ex)
    {
        logger.error('[DVP-SystemRegistry.GetAllServices] - [%s] - Exception occurred', reqId, ex);
        var jsonString = messageFormatter.FormatMessage(err, "", true, serviceRegInfo);
        logger.debug('[DVP-SystemRegistry.GetAllServices] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();

});

server.get('/DVP/API/' + hostVersion + '/SystemRegistry/GetBaseServiceById/:id', function(req, res, next)
{
    var reqId = nodeUuid.v1();
    try
    {
        var id = req.params.id;

        logger.debug('[DVP-SystemRegistry.GetBaseServiceById] - [%s] - HTTP Request Received - Req Params - id : %s', reqId, id);

        sysRegBackendHandler.GetBaseServiceDetailsById(reqId, id, function (err, result)
        {
            if (err || !result)
            {
                var jsonString = messageFormatter.FormatMessage(err, "", false, result);
                logger.debug('[DVP-SystemRegistry.GetBaseServiceById] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);
            }
            else
            {
                var jsonString = messageFormatter.FormatMessage(err, "", true, result);
                logger.debug('[DVP-SystemRegistry.GetBaseServiceById] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);
            }
        });
    }
    catch(ex)
    {
        logger.error('[DVP-SystemRegistry.GetBaseServiceById] - [%s] - Exception occurred', reqId, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "", false, undefined);
        logger.debug('[DVP-SystemRegistry.GetBaseServiceById] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();

});

server.get('/DVP/API/' + hostVersion + '/SystemRegistry/GetExtendedServiceById/:id', function(req, res, next)
{
    var reqId = nodeUuid.v1();
    try
    {
        var id = req.params.id;

        logger.debug('[DVP-SystemRegistry.GetExtendedServiceById] - [%s] - HTTP Request Received - Req Params - id : %s', reqId, id);

        sysRegBackendHandler.GetExtendedServiceDetailsById(reqId, id, function (err, result)
        {
            if (err || !result)
            {
                var jsonString = messageFormatter.FormatMessage(err, "", false, result);
                logger.debug('[DVP-SystemRegistry.GetExtendedServiceById] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);
            }
            else
            {
                var jsonString = messageFormatter.FormatMessage(err, "", true, result);
                logger.debug('[DVP-SystemRegistry.GetExtendedServiceById] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);
            }
        });
    }
    catch(ex)
    {
        logger.error('[DVP-SystemRegistry.GetExtendedServiceById] - [%s] - Exception occurred', reqId, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "", false, undefined);
        logger.debug('[DVP-SystemRegistry.GetExtendedServiceById] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();

});

server.get('/DVP/API/' + hostVersion + '/RegistryInfo/GetRegistryInfoByName/:serviceName', function(req, res, next)
{
    var reqId = nodeUuid.v1();
    try
    {
        var serviceName = req.params.serviceName;

        logger.debug('[DVP-SystemRegistry.GetRegistryInfoByName] - [%s] - HTTP Request Received - Req Params - serviceName : %s', reqId, serviceName);

        sysRegBackendHandler.GetServiceRegistryDeploymentInfo(reqId, serviceName, function (err, result)
        {
            if (err || !result)
            {
                var jsonString = messageFormatter.FormatMessage(err, "", false, result);
                logger.debug('[DVP-SystemRegistry.GetRegistryInfoByName] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);
            }
            else
            {
                var jsonString = messageFormatter.FormatMessage(err, "", true, result);
                logger.debug('[DVP-SystemRegistry.GetRegistryInfoByName] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);
            }
        });
    }
    catch(ex)
    {
        logger.error('[DVP-SystemRegistry.GetRegistryInfoByName] - [%s] - Exception occurred', reqId, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "", false, undefined);
        logger.debug('[DVP-SystemRegistry.GetRegistryInfoByName] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();

});

server.post('/DVP/API/' + hostVersion + '/RegistryInfo/AddBaseService', function(req, res, next)
{
    var reqId = nodeUuid.v1();
    try
    {
        var baseServiceInfo = req.body;

        logger.debug('[DVP-SystemRegistry.AddBaseService] - [%s] - HTTP Request Received - Req Body : %s', reqId, req.body);

        var baseService = dbModel.BaseService.build({
            ServiceName: baseServiceInfo.ServiceName,
            Description: baseServiceInfo.Description,
            ServiceVersion: baseServiceInfo.ServiceVersion,
            ServiceVersionStatus: baseServiceInfo.ServiceVersionStatus,
            SourceUrl: baseServiceInfo.SourceUrl,
            DockerUrl: baseServiceInfo.DockerUrl,
            ObjClass: baseServiceInfo.ObjClass,
            ObjType: baseServiceInfo.ObjType,
            ObjCategory: baseServiceInfo.ObjCategory,
            NoOfPorts: baseServiceInfo.NoOfPorts,
            PortType: baseServiceInfo.PortType,
            ServiceProtocol: baseServiceInfo.ServiceProtocol,
            Importance: baseServiceInfo.Importance
        });

        sysRegBackendHandler.AddSystemService(reqId, baseService, function (err, result)
        {
            if (err || !result)
            {
                var jsonString = messageFormatter.FormatMessage(err, "", result, undefined);
                logger.debug('[DVP-SystemRegistry.AddBaseService] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);
            }
            else
            {
                var jsonString = messageFormatter.FormatMessage(err, "", result, undefined);
                logger.debug('[DVP-SystemRegistry.AddBaseService] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);
            }
        });
    }
    catch(ex)
    {
        logger.error('[DVP-SystemRegistry.AddBaseService] - [%s] - Exception occurred', reqId, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "", false, undefined);
        logger.debug('[DVP-SystemRegistry.AddBaseService] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();

});

server.post('/DVP/API/' + hostVersion + '/RegistryInfo/AddExtendedService', function(req, res, next)
{
    var reqId = nodeUuid.v1();
    try
    {
        var extServiceInfo = req.body;

        logger.debug('[DVP-SystemRegistry.AddExtendedService] - [%s] - HTTP Request Received - Req Body : %s', reqId, extServiceInfo);

        var extService = dbModel.ExtendedService.build({
            ServiceName: extServiceInfo.ServiceName,
            Description: extServiceInfo.Description,
            ServiceVersion: extServiceInfo.ServiceVersion,
            ServiceVersionStatus: extServiceInfo.ServiceVersionStatus,
            SourceUrl: extServiceInfo.SourceUrl,
            DockerUrl: extServiceInfo.DockerUrl,
            ObjClass: extServiceInfo.ObjClass,
            ObjType: extServiceInfo.ObjType,
            ObjCategory: extServiceInfo.ObjCategory,
            NoOfPorts: extServiceInfo.NoOfPorts,
            PortType: extServiceInfo.PortType,
            ServiceProtocol: extServiceInfo.ServiceProtocol,
            Importance: extServiceInfo.Importance
        });

        sysRegBackendHandler.AddSystemService(reqId, extService, function (err, result)
        {
            if (err || !result)
            {
                var jsonString = messageFormatter.FormatMessage(err, "", result, undefined);
                logger.debug('[DVP-SystemRegistry.AddExtendedService] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);
            }
            else
            {
                var jsonString = messageFormatter.FormatMessage(err, "", result, undefined);
                logger.debug('[DVP-SystemRegistry.AddExtendedService] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);
            }
        });
    }
    catch(ex)
    {
        logger.error('[DVP-SystemRegistry.AddExtendedService] - [%s] - Exception occurred', reqId, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "", false, undefined);
        logger.debug('[DVP-SystemRegistry.AddExtendedService] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();

});

server.post('/DVP/API/' + hostVersion + '/RegistryInfo/AddAttachedService', function(req, res, next)
{
    var reqId = nodeUuid.v1();
    try
    {
        var attServiceInfo = req.body;

        logger.debug('[DVP-SystemRegistry.AddAttachedService] - [%s] - HTTP Request Received - Req Body : %s', reqId, attServiceInfo);

        var attService = dbModel.AttachedService.build({
            AttServiceName: attServiceInfo.AttServiceName,
            Description: attServiceInfo.Description,
            ObjClass: attServiceInfo.ObjClass,
            ObjType: attServiceInfo.ObjType,
            ObjCategory: attServiceInfo.ObjCategory
        });

        sysRegBackendHandler.AddSystemService(reqId, attService, function (err, result)
        {
            if (err || !result)
            {
                var jsonString = messageFormatter.FormatMessage(err, "", result, undefined);
                logger.debug('[DVP-SystemRegistry.AddAttachedService] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);
            }
            else
            {
                var jsonString = messageFormatter.FormatMessage(err, "", result, undefined);
                logger.debug('[DVP-SystemRegistry.AddAttachedService] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);
            }
        });
    }
    catch(ex)
    {
        logger.error('[DVP-SystemRegistry.AddAttachedService] - [%s] - Exception occurred', reqId, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "", false, undefined);
        logger.debug('[DVP-SystemRegistry.AddAttachedService] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();

});

server.post('/DVP/API/' + hostVersion + '/RegistryInfo/AddAttachedServiceToBase/:baseId/:attId', function(req, res, next)
{
    var reqId = nodeUuid.v1();
    try
    {
        var baseId = req.params.baseId;
        var attId = req.params.attId;

        logger.debug('[DVP-SystemRegistry.AddAttachedServiceToBase] - [%s] - HTTP Request Received - Req Params - baseId : %s, attId : %s', reqId, baseId, attId);

        sysRegBackendHandler.AddBaseServiceToAttached(reqId, baseId, attId, function (err, result)
        {
            if (err || !result)
            {
                var jsonString = messageFormatter.FormatMessage(err, "", result, undefined);
                logger.debug('[DVP-SystemRegistry.AddAttachedServiceToBase] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);
            }
            else
            {
                var jsonString = messageFormatter.FormatMessage(err, "", result, undefined);
                logger.debug('[DVP-SystemRegistry.AddAttachedServiceToBase] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);
            }
        });
    }
    catch(ex)
    {
        logger.error('[DVP-SystemRegistry.AddAttachedServiceToBase] - [%s] - Exception occurred', reqId, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "", false, undefined);
        logger.debug('[DVP-SystemRegistry.AddAttachedServiceToBase] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();

});

server.post('/DVP/API/' + hostVersion + '/RegistryInfo/AddAttachedServiceToExtended/:extId/:attId', function(req, res, next)
{
    var reqId = nodeUuid.v1();
    try
    {
        var extId = req.params.extId;
        var attId = req.params.attId;

        logger.debug('[DVP-SystemRegistry.AddAttachedServiceToExtended] - [%s] - HTTP Request Received - Req Params - extId : %s, attId : %s', reqId, extId, attId);

        sysRegBackendHandler.AddExtendedServiceToAttached(reqId, extId, attId, function (err, result)
        {
            if (err || !result)
            {
                var jsonString = messageFormatter.FormatMessage(err, "", result, undefined);
                logger.debug('[DVP-SystemRegistry.AddAttachedServiceToExtended] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);
            }
            else
            {
                var jsonString = messageFormatter.FormatMessage(err, "", result, undefined);
                logger.debug('[DVP-SystemRegistry.AddAttachedServiceToExtended] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);
            }
        });
    }
    catch(ex)
    {
        logger.error('[DVP-SystemRegistry.AddAttachedServiceToExtended] - [%s] - Exception occurred', reqId, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "", false, undefined);
        logger.debug('[DVP-SystemRegistry.AddAttachedServiceToExtended] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();

});

server.post('/DVP/API/' + hostVersion + '/RegistryInfo/AddBaseServiceToExtended/:baseId/:extId', function(req, res, next)
{
    var reqId = nodeUuid.v1();
    try
    {
        var extId = req.params.extId;
        var baseId = req.params.baseId;

        logger.debug('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - HTTP Request Received - Req Params - extId : %s, base : %s', reqId, extId, baseId);

        sysRegBackendHandler.AddBaseServiceToExtended(reqId, baseId, extId, function (err, result)
        {
            if (err || !result)
            {
                var jsonString = messageFormatter.FormatMessage(err, "", result, undefined);
                logger.debug('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);
            }
            else
            {
                var jsonString = messageFormatter.FormatMessage(err, "", result, undefined);
                logger.debug('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);
            }
        });
    }
    catch(ex)
    {
        logger.error('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - Exception occurred', reqId, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "", false, undefined);
        logger.debug('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();

});



*/
////////////////////////////////////////////////////////////////////////////////////////////////////

server.get('/DVP/API/:version/SystemRegistry/Images', function(req, res, next){

    logger.debug("DVP-SystemRegistry.GetImages HTTP  ");


    dbModel.Image.findAll({include: [{model: dbModel.Variable, as: "SystemVariables"}]}).complete(function (err, imageInstance) {

        if (!err) {



            try {


                logger.debug("DVP-SystemRegistry.GetImages Found ");

                var instance = msg.FormatMessage(undefined, "Get Images done", true, imageInstance);
                res.write(instance);

            } catch(exp) {



            }

        } else {

            logger.error("DVP-SystemRegistry.GetImages Failed", err);

            var instance = msg.FormatMessage(err, "Get Images failed", false, undefined);
            res.write(instance);
        }

        res.end();

    });


    return next();

});

server.get('/DVP/API/:version/SystemRegistry/Image/:id', function(req, res, next){

    logger.debug("DVP-SystemRegistry.GetImage HTTP  ");


    dbModel.Image.find({ where: [{id: parseInt(req.params.id)}], include: [{model: dbModel.Variable, as: "SystemVariables"}]}).complete(function (err, imageInstance) {

        if (!err) {



            try {


                logger.debug("DVP-SystemRegistry.GetImages Found ");

                var instance = msg.FormatMessage(undefined, "Get Images done", true, imageInstance);
                res.write(instance);

            } catch(exp) {



            }

        } else {

            logger.error("DVP-SystemRegistry.GetImages Failed", err);

            var instance = msg.FormatMessage(err, "Get Images failed", false, undefined);
            res.write(instance);
        }

        res.end();

    });

    return next();


});

server.get('/DVP/API/:version/SystemRegistry/ImageByName/:name', function(req, res, next){

    logger.debug("DVP-SystemRegistry.GetImage HTTP  ");


    dbModel.Image.find({ where: [{Name: req.params.name}], include: [{model: dbModel.Variable, as: "SystemVariables"}]}).complete(function (err, imageInstance) {

        if (!err) {



            try {


                logger.debug("DVP-SystemRegistry.GetImages Found ");

                var instance = msg.FormatMessage(undefined, "Get Images done", true, imageInstance);
                res.write(instance);

            } catch(exp) {



            }

        } else {

            logger.error("DVP-SystemRegistry.GetImages Failed", err);

            var instance = msg.FormatMessage(err, "Get Images failed", false, undefined);
            res.write(instance);
        }

        res.end();

    });

    return next();

});

server.post('/DVP/API/:version/SystemRegistry/Image', function(req, res, next){

    var imageData=req.body;
    var status = false;
    if(imageData) {

        var image = dbModel.Image.build({


            Name: imageData.Name,
            Description: imageData.Description,
            Version: imageData.Version,
            VersionStatus: imageData.VersionStatus,
            SourceUrl: imageData.SourceUrl,
            DockerUrl: imageData.DockerUrl,
            Class: imageData.Class,
            Type: imageData.Type,
            Category: imageData.Category,
            Importance: imageData.Importance


        });


        image
            .save()
            .complete(function (err) {
                try {

                    if (err) {
                        logger.error("DVP-SystemRegistry.CteateImage PGSQL save failed ", err);

                        var instance = msg.FormatMessage(err,"Store Image Failed", status,undefined);
                        res.write(instance);
                        res.end();


                    }
                    else {
                        logger.debug('DVP-SystemRegistry.CteateImage PGSQL Cloud object saved successful ');
                        status = true;

                        var instance = msg.FormatMessage(undefined,"Store Image Done", status,undefined);
                        res.write(instance);
                        res.end();
                    }

                }
                catch (ex) {
                    logger.error("DVP-SystemRegistry.CteateImage failed ", ex);

                }

            });
    }else{

        logger.error("DVP-SystemRegistry.CteateImage Object Validation Failed");
        var instance = msg.FormatMessage(undefined,"Store Image Object Validation Failed", status,undefined);
        res.write(instance);
        res.end();
    }


    return next();


});

server.put('/DVP/API/:version/SystemRegistry/Image/:name', function(req, res, next){});

server.del('/DVP/API/:version/SystemRegistry/Image/:name', function(req, res, next){});

server.post('/DVP/API/:version/SystemRegistry/Image/:imageName/Variable', function(req, res, next){


    logger.debug("DVP-SystemRegistry.AddVariable HTTP");

    var variableData=req.body;
    var imageName = req.params.imageName;
    var status = false;


    if(variableData){

        dbModel.Image.find({where: [{ Name: imageName}]}).complete(function(err, imageInstance) {
            if(!err && imageInstance) {
                logger.debug("DVP-SystemRegistry.AddVariable Cloud Found ");

                var variableInstance = dbModel.Variable.build(
                    {
                        Name: variableData.Name,
                        Description: variableData.Description,
                        DefaultValue: variableData.DefaultValue,
                        Export: variableData.Export,
                        Type: variableData.Type
                    }
                )


                variableInstance
                    .save()
                    .complete(function (err) {

                        if (!err) {


                            logger.debug("DVP-SystemRegistry.AddVariable Variable Saved ");

                            imageInstance.addSystemVariables(variableInstance).complete(function (errx, cloudInstancex) {

                                logger.debug("DVP-SystemRegistry.AddVariable Variable Set Image");

                                if(!errx) {

                                    status = true;
                                    var instance = msg.FormatMessage(undefined, "Add Variable", status, undefined);
                                    res.write(instance);
                                    res.end();

                                }else{

                                    var instance = msg.FormatMessage(errx, "Add Variable failed", status, undefined);
                                    res.write(instance);
                                    res.end();

                                }


                            });


                        } else {

                            var instance = msg.FormatMessage(err, "Add Variable", status, undefined);
                            res.write(instance);

                            logger.error("DVP-SystemRegistry.AddVariable variable Save Failed ",err);

                        }
                    }
                )
            }
            else
            {
                logger.error("DVP-SystemRegistry.AddVariable Image NotFound ");
                var instance = msg.FormatMessage(undefined, "Add AddVariable failed no image", status, undefined);
                res.write(instance);
                res.end();

            }

        })


    }
    else{

        var instance = msg.FormatMessage(undefined, "Add Variable", status, undefined);
        res.write(instance);
        res.end();
        logger.debug("DVP-SystemRegistry.AddVariable Object Validation Failed ");

    }

    return next();

});

server.get('/DVP/API/:version/SystemRegistry/Templates', function(req, res, next){


    logger.debug("DVP-SystemRegistry.GetTemplates HTTP  ");


    dbModel.Template.findAll({include: [{model: dbModel.Image, as: "TemplateImage"}]}).complete(function (err, templateInstance) {

        if (!err) {



            try {


                logger.debug("DVP-SystemRegistry.GetTemplates Found ");

                var instance = msg.FormatMessage(undefined, "Get Templates done", true, templateInstance);
                res.write(instance);

            } catch(exp) {


                logger.error("DVP-SystemRegistry.GetTemplates Failed", exp);

            }

        } else {

            logger.error("DVP-SystemRegistry.GetTemplates Failed", err);

            var instance = msg.FormatMessage(err, "Get Templates failed", false, undefined);
            res.write(instance);
        }

        res.end();

    });

    return next();


});

server.get('/DVP/API/:version/SystemRegistry/Template/:id', function(req, res, next){


    logger.debug("DVP-SystemRegistry.GetTemplate HTTP  ");


    dbModel.Template.findAll({ where: [{id: parseInt(req.params.id)}], include: [{model: dbModel.Image, as: "TemplateImage"}]}).complete(function (err, templateInstance) {

        if (!err) {



            try {


                logger.debug("DVP-SystemRegistry.GetTemplate %d Found %j",parseInt(req.params.id),   templateInstance);

                var instance = msg.FormatMessage(undefined, "Get Template done", true, templateInstance);
                res.write(instance);

            } catch(exp) {



            }

        } else {

            logger.error("DVP-SystemRegistry.GetTemplate Failed", err);

            var instance = msg.FormatMessage(err, "Get Template failed", false, undefined);
            res.write(instance);
        }

        res.end();

    });

    return next();


});

server.get('/DVP/API/:version/SystemRegistry/TemplateByName/:name', function(req, res, next){

    logger.debug("DVP-SystemRegistry.GetTemplate HTTP  ");


    dbModel.Template.findAll({ where: [{Name: req.params.name}], include: [{model: dbModel.Image, as: "TemplateImage"}]}).complete(function (err, templateInstance) {

        if (!err) {



            try {


                logger.debug("DVP-SystemRegistry.GetTemplate %s Found %j",req.params.name,   templateInstance);

                var instance = msg.FormatMessage(undefined, "Get Template done", true, templateInstance);
                res.write(instance);

            } catch(exp) {



            }

        } else {

            logger.error("DVP-SystemRegistry.GetTemplate Failed", err);

            var instance = msg.FormatMessage(err, "Get Template failed", false, undefined);
            res.write(instance);
        }

        res.end();

    });

    return next();

});

server.post('/DVP/API/:version/SystemRegistry/Template', function(req, res, next){

    var templateData=req.body;
    var status = false;
    if(templateData) {

        var template = dbModel.Template.build({


            Name: templateData.Name,
            Description: templateData.Description,
            Class: templateData.Class,
            Type: templateData.Type,
            Category: templateData.Category,
            CompanyId: 1,
            TenantId: 3


        });


        template
            .save()
            .complete(function (err) {
                try {

                    if (err) {
                        logger.error("DVP-SystemRegistry.CreateTemplate PGSQL save failed ", err);

                        var instance = msg.FormatMessage(err,"Store Template Failed", status,undefined);
                        res.write(instance);
                        res.end();


                    }
                    else {
                        logger.debug('DVP-SystemRegistry.CreateTemplate PGSQL Cloud object saved successful %j', template);
                        status = true;

                        var instance = msg.FormatMessage(undefined,"Store Template Done", status,undefined);
                        res.write(instance);
                        res.end();
                    }

                }
                catch (ex) {
                    logger.error("DVP-SystemRegistry.CreateTemplate failed ", ex);

                    res.end();


                }

            });
    }else{

        logger.error("DVP-SystemRegistry.CreateTemplate Object Validation Failed");
        var instance = msg.FormatMessage(undefined,"Store Template Object Validation Failed", status,undefined);
        res.write(instance);
        res.end();
    }


    return next();

});

server.put('/DVP/API/:version/SystemRegistry/Template/:name', function(req, res, next){});

server.del('/DVP/API/:version/SystemRegistry/Template/:name', function(req, res, next){});

server.post('/DVP/API/:version/SystemRegistry/Template/:templateName/AddBaseImage/:imageName', function(req, res, next){


    var templateName = req.params.templateName;
    var imageName = req.params.imageName;


    logger.debug("DVP-SystemRegistry.AddImageToTemplate id HTTP %s to %s", templateName, imageName);
    var status = false;
    dbModel.Template.find({where: [{Name: templateName}]}).complete(function (err, templateInstance) {

        if (!err && templateInstance) {

            logger.debug("DVP-SystemRegistry.AddImageToTemplate PGSQL template %s Found %j", templateName, templateInstance);


            dbModel.Image.find({where: [{Name: imageName}, {Activate: true}]}).complete(function (err, imageInstance) {

                if (!err && imageInstance) {

                    logger.debug("DVP-SystemRegistry.AddImageToTemplate PGSQL Image %s Found %j", imageName, imageInstance);

                    templateInstance.addTemplateImage(image, { Type: 'Mandetory' }).complete(function (errx, cloudInstancex) {

                        logger.debug("DVP-SystemRegistry.AddImageToTemplate PGSQL");

                        if(!errx) {
                            status = true;
                            var instance = msg.FormatMessage(undefined, "AddImage To Template", status, undefined);
                            res.write(instance);
                            res.end();
                        }else{

                            var instance = msg.FormatMessage(errx, "AddImage To Template failed", status, undefined);
                            res.write(instance);
                            res.end();


                        }

                    });

                } else {

                    logger.error("DVP-SystemRegistry.AddImageToTemplate PGSQL Cloud %s NotFound", cloudID, err);

                    var instance = msg.FormatMessage(undefined, "AddImage To Template", status, undefined);
                    res.write(instance);

                    res.end();
                }


            })

        } else {

            logger.debug("DVP-SystemRegistry.AddCallServerToCloud PGSQL CallServer %s NotFound %j", Id, err);

            var instance = msg.FormatMessage(undefined, "AddCallservers to cloud", status, undefined);
            res.write(instance);
            res.end();
        }

    });

    return next();


});

server.post('/DVP/API/:version/SystemRegistry/Template/:templateID/AddOptionalImage/:imageID', function(req, res, next){

    var templateName = req.params.templateName;
    var imageName = req.params.imageName;


    logger.debug("DVP-SystemRegistry.AddImageToTemplate id HTTP %s to %s", templateName, imageName);
    var status = false;
    dbModel.Template.find({where: [{Name: templateName}]}).complete(function (err, templateInstance) {

        if (!err && templateInstance) {

            logger.debug("DVP-SystemRegistry.AddImageToTemplate PGSQL template %s Found", templateName);


            dbModel.Image.find({where: [{Name: imageName}, {Activate: true}]}).complete(function (err, imageInstance) {

                if (!err && imageInstance) {

                    logger.debug("DVP-SystemRegistry.AddImageToTemplate PGSQL Image %s Found", imageName);

                    templateInstance.addTemplateImage(image, { Type: 'Optional' }).complete(function (errx, cloudInstancex) {

                        logger.debug("DVP-SystemRegistry.AddImageToTemplate PGSQL");

                        if(!errx) {
                            status = true;
                            var instance = msg.FormatMessage(undefined, "AddImage To Template", status, undefined);
                            res.write(instance);
                            res.end();
                        }else{

                            var instance = msg.FormatMessage(errx, "AddImage To Template failed", status, undefined);
                            res.write(instance);
                            res.end();


                        }

                    });

                } else {

                    logger.error("DVP-SystemRegistry.AddImageToTemplate PGSQL Cloud %s NotFound", cloudID, err);

                    var instance = msg.FormatMessage(undefined, "AddImage To Template", status, undefined);
                    res.write(instance);

                    res.end();
                }


            })

        } else {

            logger.debug("DVP-SystemRegistry.AddCallServerToCloud PGSQL CallServer %s NotFound %j", Id, err);

            var instance = msg.FormatMessage(undefined, "AddCallservers to cloud", status, undefined);
            res.write(instance);
            res.end();
        }

    })


    return next();

});

server.get('/DVP/API/:version/SystemRegistry/Template/:templateID/BaseImages', function(req, res, next){});

server.get('/DVP/API/:version/SystemRegistry/Template/:templateID/OptionalImages', function(req, res, next){});

server.get('/DVP/API/:version/SystemRegistry/Variable/:name', function(req, res, next){});

server.del('/DVP/API/:version/SystemRegistry/Variable/:name', function(req, res, next){});

server.get('/DVP/API/:version/SystemRegistry/Variables', function(req, res, next){});

server.put('/DVP/API/:version/SystemRegistry/Variable/:name', function(req, res, next){});




////////////////////////////////////////////////////////////////////////////////////////////////////


var basepath = 'http://'+ "127.0.0.1" + ':' + hostPort;


sre.init(server, {
        resourceName : 'SystemRegistryService',
        server : 'restify', // or express
        httpMethods : ['GET', 'POST', 'PUT', 'DELETE'],
        basePath : basepath,
        ignorePaths : {
            GET : ['path1', 'path2'],
            POST : ['path1']
        }
    }
)



server.listen(hostPort, hostIp, function () {
    console.log('%s listening at %s', server.name, server.url);
});