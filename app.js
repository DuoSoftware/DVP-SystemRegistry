var restify = require('restify');
var config = require('config');
var stringify = require('stringify');
var sysRegBackendHandler = require('./SysRegBackendHandler.js');
var dbModel = require('dvp-dbmodels');
var nodeUuid = require('node-uuid');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var msg = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var messageFormatter = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var sre = require('swagger-restify-express');
var mongoose = require('mongoose');
var underscore = require('underscore');


var hostIp = config.Host.Ip;
var hostPort = config.Host.Port;
var hostVersion = config.Host.Version;

var mongoDbIp = config.MongoDB.Ip;
var mongoDbDb = config.MongoDB.Database;
var mongoDbPort = config.MongoDB.Port;

var server = restify.createServer({
    name: 'localhost',
    version: '1.0.0'
});


restify.CORS.ALLOW_HEADERS.push('authorization');
server.use(restify.CORS());
server.use(restify.fullResponse());

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

var mongoUrl = 'mongodb://' + mongoDbIp + ':' + mongoDbPort + '/' + mongoDbDb;

var conn = mongoose.connect(mongoUrl);

var schema = new mongoose.Schema({_id: {type: String}, UUID: {type: String}}, { strict: false });

var Model = mongoose.model('SwarmNode', schema);

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

server.get('/DVP/API/:version/SystemRegistry/Images', function(req, res, next)
{

    logger.debug("DVP-SystemRegistry.GetImages HTTP  ");

    var tempArr = [];

    dbModel.Image.findAll({include: [{model: dbModel.Variable, as: "SystemVariables"},{model: dbModel.Image, as: "Dependants"},{model: dbModel.Service, as :"Services"}]})
        .then(function (imageInstance)
        {
            logger.debug("DVP-SystemRegistry.GetImages Found ");

            var instance = msg.FormatMessage(undefined, "Get Images done", true, imageInstance);
            res.write(instance);

            res.end();

        })
        .catch(function(err)
        {
            logger.error("DVP-SystemRegistry.GetImages Failed", err);

            var instance = msg.FormatMessage(err, "Get Images failed", false, tempArr);
            res.write(instance);
            res.end();
        });


    return next();

});

server.get('/DVP/API/:version/SystemRegistry/Image/:id', function(req, res, next)
{

    logger.debug("DVP-SystemRegistry.GetImage HTTP  ");

    dbModel.Image.find({ where: [{id: parseInt(req.params.id)}], include: [{model: dbModel.Variable, as: "SystemVariables"},{model: dbModel.Image, as: "Dependants"},{model: dbModel.Service, as :"Services"}]})
        .then(function (imageInstance)
        {

            logger.debug("DVP-SystemRegistry.GetImages Found ");

            var instance = msg.FormatMessage(undefined, "Get Images done", true, imageInstance);
            res.write(instance);

            res.end();

        })
        .catch(function(err)
        {
            logger.error("DVP-SystemRegistry.GetImages Failed", err);

            var instance = msg.FormatMessage(err, "Get Images failed", false, undefined);
            res.write(instance);
            res.end();
        });

    return next();


});

server.get('/DVP/API/:version/SystemRegistry/ImageByName/:name', function(req, res, next){

    logger.debug("DVP-SystemRegistry.GetImageByName HTTP  ");

    dbModel.Image.find({ where: [{Name: req.params.name}], include: [{model: dbModel.Variable, as: "SystemVariables"},{model: dbModel.Image, as: "Dependants"},{model: dbModel.Service, as :"Services"}]})
        .then(function (imageInstance)
        {
            logger.debug("DVP-SystemRegistry.GetImages Found ");

            var instance = msg.FormatMessage(undefined, "Get Images done", true, imageInstance);
            res.write(instance);

            res.end();

        })
        .catch(function(err)
        {
            logger.error("DVP-SystemRegistry.GetImages Failed", err);

            var instance = msg.FormatMessage(err, "Get Images failed", false, undefined);
            res.write(instance);
            res.end();
        });

    return next();

});

server.post('/DVP/API/:version/SystemRegistry/Image', function(req, res, next)
{
    var imageData=req.body;
    var status = false;

    if(imageData)
    {
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
            Importance: imageData.Importance,
            Cmd: imageData.Cmd

        });

        image
            .save()
            .then(function (rslt)
            {
                logger.debug('DVP-SystemRegistry.CteateImage PGSQL Cloud object saved successful ');
                status = true;

                var instance = msg.FormatMessage(undefined,"Store Image Done", status, rslt);
                res.write(instance);
                res.end();

            })
            .catch(function(err)
            {
                logger.error("DVP-SystemRegistry.CteateImage PGSQL save failed ", err);

                var instance = msg.FormatMessage(err,"Store Image Failed", status, undefined);
                res.write(instance);
                res.end();
            });
    }
    else
    {

        logger.error("DVP-SystemRegistry.CteateImage Object Validation Failed");
        var instance = msg.FormatMessage(undefined,"Store Image Object Validation Failed", status, undefined);
        res.write(instance);
        res.end();
    }

    return next();

});

server.post('/DVP/API/:version/SystemRegistry/Image/:imageName/Service', function(req, res, next)
{
    logger.debug("DVP-SystemRegistry.AddService HTTP");

    var variableData = req.body;
    var imageName = req.params.imageName;
    var status = false;

    if(variableData)
    {
        dbModel.Image.find({where: [{ Name: imageName}]})
            .then(function(imageInstance)
            {
                if(imageInstance)
                {
                    logger.debug("DVP-SystemRegistry.AddService image Found ");

                    var serviceInstance = dbModel.Service.build(
                        {
                            Name: variableData.Name,
                            Description: variableData.Description,
                            Class: variableData.Class,
                            Type: variableData.Type,
                            Category: variableData.Category,
                            CompanyId: variableData.CompanyId,
                            TenantId: variableData.TenantId,
                            MultiPorts: variableData.MultiPorts,
                            Direction: variableData.Direction,
                            Protocol: variableData.Protocol,
                            DefaultStartPort: variableData.Port
                        })


                    serviceInstance
                        .save()
                        .then(function (rslt)
                        {

                            logger.debug("DVP-SystemRegistry.AddService Service Saved ");

                            imageInstance.addServices(serviceInstance)
                                .then(function (cloudInstancex)
                                {
                                    logger.debug("DVP-SystemRegistry.AddService Service Set Image");

                                    status = true;
                                    var instance = msg.FormatMessage(undefined, "Add Service", status, cloudInstancex);
                                    res.write(instance);
                                    res.end();

                                })
                                .catch(function(err)
                                {
                                    var instance = msg.FormatMessage(err, "Add Service failed", status, undefined);
                                    res.write(instance);
                                    res.end();
                                });
                        })
                        .catch(function(err)
                        {
                            logger.error("DVP-SystemRegistry.AddService Service Save Failed ", err);
                            var instance = msg.FormatMessage(err, "Add Service", status, undefined);
                            res.write(instance);
                            res.end();
                        })
            }
            else
            {
                logger.error("DVP-SystemRegistry.AddService Image NotFound ");
                var instance = msg.FormatMessage(undefined, "Add AddService failed no image", status, undefined);
                res.write(instance);
                res.end();

            }

        })
        .catch(function(err)
        {
            logger.error("DVP-SystemRegistry.AddService Service Save Failed ", err);
            var instance = msg.FormatMessage(err, "Add Service", status, undefined);
            res.write(instance);
            res.end();
        })

    }
    else
    {
        logger.debug("DVP-SystemRegistry.AddService Object Validation Failed");
        var instance = msg.FormatMessage(new Error('Variable data not provided'), "Variable data not provided", status, undefined);
        res.write(instance);
        res.end();

    }

    return next();

});

server.post('/DVP/API/:version/SystemRegistry/Image/:imageName/DependOn/:dependImageName', function(req, res, next)
{
    logger.debug("DVP-SystemRegistry.ImageDependsOn HTTP");

    var imageName = req.params.imageName;
    var dependimage = req.params.dependImageName;
    var status = false;

    dbModel.Image.find({where: [{ Name: imageName}]})
        .then(function(imageInstance)
        {
            if (imageInstance)
            {
                logger.debug("DVP-SystemRegistry.ImageDependsOn image Found ");

                dbModel.Image.find({where: [{Name: dependimage}]})
                    .then(function (depimageInstance)
                    {
                            if (depimageInstance)
                            {
                                logger.debug("DVP-SystemRegistry.ImageDependsOn Service Saved ");

                                imageInstance.addDependants(depimageInstance, {DependantId: imageInstance.id})
                                    .then(function (depimageInstancex)
                                    {
                                        logger.debug("DVP-SystemRegistry.ImageDependsOn Service Set Image");

                                        status = true;
                                        var instance = msg.FormatMessage(undefined, "Add Image", status, depimageInstancex);
                                        res.write(instance);
                                        res.end();

                                    })
                                    .catch(function(err)
                                    {
                                        var instance = msg.FormatMessage(err, "Add Image failed", status, undefined);
                                        res.write(instance);
                                        res.end();
                                    });
                            }
                            else
                            {
                                var instance = msg.FormatMessage(err, "Add Image", status, undefined);
                                res.write(instance);

                                logger.error("DVP-SystemRegistry.ImageDependsOn one of the image not found ", err);

                            }
                    })
                    .catch(function(err)
                    {
                        var instance = msg.FormatMessage(err, "Add Image failed", status, undefined);
                        res.write(instance);
                        res.end();
                    })
            }
            else
            {
                logger.error("DVP-SystemRegistry.ImageDependsOn Image NotFound ");
                var instance = msg.FormatMessage(undefined, "Add Image failed no image", status, undefined);
                res.write(instance);
                res.end();

            }

    })
    .catch(function(err)
    {
        var instance = msg.FormatMessage(err, "Add Image failed", status, undefined);
        res.write(instance);
        res.end();
    })


    return next();

});

server.put('/DVP/API/:version/SystemRegistry/Image/:name', function(req, res, next){});

server.del('/DVP/API/:version/SystemRegistry/Image/:name', function(req, res, next){});

server.post('/DVP/API/:version/SystemRegistry/Image/:imageName/Variable', function(req, res, next)
{

    logger.debug("DVP-SystemRegistry.AddVariable HTTP");

    var variableData=req.body;
    var imageName = req.params.imageName;
    var status = false;

    if(variableData)
    {
        dbModel.Image.find({where: [{ Name: imageName}]})
            .then(function(imageInstance)
            {
                if(imageInstance)
                {
                    logger.debug("DVP-SystemRegistry.AddVariable Cloud Found ");

                    var variableInstance = dbModel.Variable.build(
                        {
                            Name: variableData.Name,
                            Description: variableData.Description,
                            DefaultValue: variableData.DefaultValue,
                            Export: variableData.Export,
                            Type: variableData.Type
                        })

                    variableInstance
                        .save()
                        .then(function (rslt)
                        {
                            logger.debug("DVP-SystemRegistry.AddVariable Variable Saved ");

                            imageInstance.addSystemVariables(variableInstance)
                                .then(function (cloudInstancex)
                                {
                                    logger.debug("DVP-SystemRegistry.AddVariable Variable Set Image");

                                    status = true;
                                    var instance = msg.FormatMessage(undefined, "Add Variable", status, cloudInstancex);
                                    res.write(instance);
                                    res.end();

                                })
                                .catch(function(err)
                                {
                                    var instance = msg.FormatMessage(err, "Add Variable failed", status, undefined);
                                    res.write(instance);
                                    res.end();
                                });
                        })
                        .catch(function(err)
                        {
                            logger.error("DVP-SystemRegistry.AddVariable variable Save Failed ", err);
                            var instance = msg.FormatMessage(err, "Add Variable", status, undefined);
                            res.write(instance);
                            res.end();

                        })
                }
                else
                {
                    logger.error("DVP-SystemRegistry.AddVariable Image NotFound ");
                    var instance = msg.FormatMessage(undefined, "Add AddVariable failed no image", status, undefined);
                    res.write(instance);
                    res.end();

                }

            })
            .catch(function(err)
            {
                var instance = msg.FormatMessage(err, "Image instance exception", status, undefined);
                res.write(instance);
                res.end();
            })

    }
    else
    {
        var instance = msg.FormatMessage(undefined, "Add Variable", status, undefined);
        res.write(instance);
        res.end();
        logger.debug("DVP-SystemRegistry.AddVariable Object Validation Failed ");

    }

    return next();

});

server.get('/DVP/API/:version/SystemRegistry/Templates', function(req, res, next)
{
    logger.debug("DVP-SystemRegistry.GetTemplates HTTP");

    var tempArr = [];

    dbModel.Template.findAll({include: [{model: dbModel.Image, as: "TemplateImage", include: [{model: dbModel.Variable, as: "SystemVariables"},{model: dbModel.Image, as: "Dependants"},{model: dbModel.Service, as :"Services"}]}]})
        .then(function (templateInstance)
        {
            logger.debug("DVP-SystemRegistry.GetTemplates Found ");

            var instance = msg.FormatMessage(undefined, "Get Templates done", true, templateInstance);
            res.write(instance);

            res.end();

        })
        .catch(function(err)
        {
            logger.error("DVP-SystemRegistry.GetTemplates Failed", err);

            var instance = msg.FormatMessage(err, "Get Templates failed", false, undefined);
            res.write(instance);
            res.end();
        });

    return next();


});

server.get('/DVP/API/:version/SystemRegistry/Template/:id', function(req, res, next)
{
    logger.debug("DVP-SystemRegistry.GetTemplate HTTP");

    dbModel.Template.findAll({ where: [{id: parseInt(req.params.id)}], include: [{model: dbModel.Image, as: "TemplateImage",include: [{model: dbModel.Variable, as: "SystemVariables"},{model: dbModel.Image, as: "Dependants"},{model: dbModel.Service, as :"Services"}]}]})
        .then(function (templateInstance)
        {

            logger.debug("DVP-SystemRegistry.GetTemplate %d Found",parseInt(req.params.id));

            var instance = msg.FormatMessage(undefined, "Get Template done", true, templateInstance);
            res.write(instance);

            res.end();

        })
        .catch(function(err)
        {
            logger.error("DVP-SystemRegistry.GetTemplate Failed", err);

            var instance = msg.FormatMessage(err, "Get Template failed", false, undefined);
            res.write(instance);
            res.end();
        });

    return next();


});

server.get('/DVP/API/:version/SystemRegistry/TemplateByName/:name', function(req, res, next)
{
    logger.debug("DVP-SystemRegistry.GetTemplate HTTP  ");

    var tempArr = [];

    dbModel.Template.findAll({ where: [{Name: req.params.name}], include: [{model: dbModel.Image, as: "TemplateImage", include: [{model: dbModel.Variable, as: "SystemVariables"},{model: dbModel.Image, as: "Dependants"},{model: dbModel.Service, as :"Services"}]}]})
        .then(function (templateInstance)
        {
            logger.debug("DVP-SystemRegistry.GetTemplate %s Found", req.params.name);

            var instance = msg.FormatMessage(undefined, "Get Template done", true, templateInstance);
            res.write(instance);

            logger.debug('DVP-SystemRegistry.GetTemplateByName - Retuned : ', JSON.stringify(instance));
            res.end();

        })
        .catch(function(err)
        {
            logger.error("DVP-SystemRegistry.GetTemplate Failed", err);

            var instance = msg.FormatMessage(err, "Get Template failed", false, tempArr);
            res.write(instance);
            res.end();
        });

    return next();

});

server.post('/DVP/API/:version/SystemRegistry/Template', function(req, res, next)
{

    var templateData = req.body;
    var status = false;

    if(templateData)
    {
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
            .then(function (rslt)
            {
                logger.debug('DVP-SystemRegistry.CreateTemplate PGSQL Cloud object saved successful ');
                status = true;

                var instance = msg.FormatMessage(undefined, "Store Template Done", status, rslt);
                res.write(instance);
                res.end();

            })
            .catch(function(err)
            {
                logger.error("DVP-SystemRegistry.CreateTemplate PGSQL save failed ", err);

                var instance = msg.FormatMessage(err,"Store Template Failed", status,undefined);
                res.write(instance);
                res.end();
            });
    }
    else
    {
        logger.error("DVP-SystemRegistry.CreateTemplate Object Validation Failed");
        var instance = msg.FormatMessage(undefined, "Store Template Object Validation Failed", status, undefined);
        res.write(instance);
        res.end();
    }

    return next();

});

server.put('/DVP/API/:version/SystemRegistry/Template/:name', function(req, res, next){});

server.del('/DVP/API/:version/SystemRegistry/Template/:name', function(req, res, next){});

server.post('/DVP/API/:version/SystemRegistry/Template/:templateName/AddBaseImage/:imageName/:priority', function(req, res, next)
{
    var templateName = req.params.templateName;
    var imageName = req.params.imageName;
    var pririty = req.params.priority;

    logger.debug("DVP-SystemRegistry.AddImageToTemplate id HTTP %s to %s", templateName, imageName);
    var status = false;

    dbModel.Template.find({where: [{Name: templateName}]})
        .then(function (templateInstance)
        {
            if (templateInstance)
            {
                logger.debug("DVP-SystemRegistry.AddImageToTemplate PGSQL template %s Found", templateName);

                dbModel.Image.find({where: [{Name: imageName}]})
                    .then(function (imageInstance)
                    {
                        if (imageInstance)
                        {

                            logger.debug("DVP-SystemRegistry.AddImageToTemplate PGSQL Image %s Found ", imageName);

                            templateInstance.addTemplateImage(imageInstance, {
                                Type: 'Mandetory',
                                Priority: parseInt(pririty)
                            })
                                .then(function (cloudInstancex)
                                {
                                    logger.debug("DVP-SystemRegistry.AddImageToTemplate PGSQL");
                                    status = true;
                                    var instance = msg.FormatMessage(undefined, "AddImage To Template", status, cloudInstancex);
                                    res.write(instance);
                                    res.end();

                                })
                                .catch(function(err)
                                {
                                    var instance = msg.FormatMessage(errx, "AddImage To Template failed", status, undefined);
                                    res.write(instance);
                                    res.end();
                                });

                        }
                        else
                        {

                            logger.error("DVP-SystemRegistry.AddImageToTemplate PGSQL image %s NotFound", imageName, err);

                            var instance = msg.FormatMessage(undefined, "AddImage To Template", status, undefined);
                            res.write(instance);

                            res.end();
                        }


                })
                .catch(function(err)
                {
                    var instance = msg.FormatMessage(err, "AddImage To Template failed", status, undefined);
                    res.write(instance);
                    res.end();
                })

            }
            else
            {

                logger.err("DVP-SystemRegistry.AddCallServerToCloud PGSQL template %s NotFound", templateName, err);

                var instance = msg.FormatMessage(undefined, "AddCallservers to cloud", status, undefined);
                res.write(instance);
                res.end();
            }

    })
    .catch(function(err)
    {
        var instance = msg.FormatMessage(err, "AddImage To Template failed", status, undefined);
        res.write(instance);
        res.end();
    });

    return next();

});

server.post('/DVP/API/:version/SystemRegistry/Template/:templateID/AddOptionalImage/:imageID/:priority', function(req, res, next)
{

    var templateName = req.params.templateName;
    var imageName = req.params.imageName;
    var pririty = req.params.priority;


    logger.debug("DVP-SystemRegistry.AddImageToTemplate id HTTP %s to %s", templateName, imageName);
    var status = false;

    dbModel.Template.find({where: [{Name: templateName}]})
        .then(function (templateInstance)
        {
            if (templateInstance)
            {

                logger.debug("DVP-SystemRegistry.AddImageToTemplate PGSQL template %s Found", templateName);

                dbModel.Image.find({where: [{Name: imageName}]})
                    .then(function (imageInstance)
                    {

                        if (imageInstance)
                        {

                            logger.debug("DVP-SystemRegistry.AddImageToTemplate PGSQL Image %s Found", imageName);

                            templateInstance.addTemplateImage(imageInstance, {
                                Type: 'Optional',
                                Priority: parseInt(pririty)
                            }).then(function (cloudInstancex)
                            {

                                logger.debug("DVP-SystemRegistry.AddImageToTemplate PGSQL");
                                    status = true;
                                    var instance = msg.FormatMessage(undefined, "AddImage To Template", status, undefined);
                                    res.write(instance);
                                    res.end();

                            }).catch(function(err)
                            {
                                var instance = msg.FormatMessage(err, "AddImage To Template failed", status, undefined);
                                res.write(instance);
                                res.end();
                            });

                        }
                        else
                        {

                            logger.error("DVP-SystemRegistry.AddImageToTemplate PGSQL image %s NotFound", imageName, err);

                            var instance = msg.FormatMessage(undefined, "AddImage To Template", status, undefined);
                            res.write(instance);

                            res.end();
                        }


                }).catch(function(err)
                    {
                        var instance = msg.FormatMessage(err, "AddImage To Template failed", status, undefined);
                        res.write(instance);
                        res.end();
                    })

            }
            else
            {

                logger.error("DVP-SystemRegistry.AddCallServerToCloud PGSQL template %s NotFound", templateName, err);

                var instance = msg.FormatMessage(undefined, "AddCallservers to cloud", status, undefined);
                res.write(instance);
                res.end();
            }

    }).catch(function(err)
        {
            var instance = msg.FormatMessage(err, "AddImage To Template failed", status, undefined);
            res.write(instance);
            res.end();
        })

    return next();

});

server.get('/DVP/API/:version/SystemRegistry/Template/:templateID/BaseImages', function(req, res, next){});

server.get('/DVP/API/:version/SystemRegistry/Template/:templateID/OptionalImages', function(req, res, next){});

server.get('/DVP/API/:version/SystemRegistry/Variable/:name', function(req, res, next){});

server.del('/DVP/API/:version/SystemRegistry/Variable/:name', function(req, res, next){});

server.get('/DVP/API/:version/SystemRegistry/Variables', function(req, res, next){});

server.put('/DVP/API/:version/SystemRegistry/Variable/:name', function(req, res, next){});

///////////////////////////////////////////swarm cluster///////////////////////////////////////////////

server.post('/DVP/API/:version/SystemRegistry/HealthMonitor/Node', function(req, res, next)
{
    try
    {
        logger.debug("DVP-SystemRegistry.HealthMonitor.Node HTTP  ");

        var reqBody = req.body;

        if(reqBody.UUID)
        {
            reqBody._id = reqBody.UUID;

            var obj = new Model(reqBody);

            obj.save(function(err, rslt)
            {
                if(err)
                {
                    logger.error("DVP-SystemRegistry.HealthMonitor.Node - Error occurred", err);
                    var respMsg = msg.FormatMessage(err, "Save Node Health Monitor Fail", false, undefined);
                    res.end(respMsg);
                }
                else
                {
                    logger.debug("DVP-SystemRegistry.HealthMonitor.Node - Success");
                    var respMsg = msg.FormatMessage(undefined, "Save Node Health Monitor Fail", true, rslt);
                    res.end(respMsg);
                }

            })
        }
        else
        {
            logger.warn("DVP-SystemRegistry.HealthMonitor.Node - UUID not found");
            var respMsg = msg.FormatMessage(new Error('UUID missing in document'), "Save Node Health Monitor Fail", false, undefined);
            res.end(respMsg);
        }


    }
    catch(ex)
    {
        logger.warn("DVP-SystemRegistry.HealthMonitor.Node - Exception occurred");
        var respMsg = msg.FormatMessage(ex, "Save Node Health Monitor Fail", false, undefined);
        res.end(respMsg);
    }

    return next();


});

server.get('/DVP/API/:version/SystemRegistry/HealthMonitor/Node/:uuid', function(req, res, next)
{
    try
    {
        logger.debug("DVP-SystemRegistry.HealthMonitor.GetNode HTTP  ");

        var uuid = req.params.uuid;

        if(uuid)
        {
            //reqBody.id = reqBody.UUID;

            Model.findById({ _id: uuid }, function(err, node)
            {
                if(err)
                {
                    logger.error("DVP-SystemRegistry.HealthMonitor.GetNode - Error occurred", err);
                    res.end('{}');
                }
                else
                {
                    if(node && node._doc)
                    {
                        logger.debug("DVP-SystemRegistry.HealthMonitor.GetNode - Success");
                        var respMsg = JSON.stringify(node._doc);
                        res.end(respMsg);
                    }
                    else
                    {
                        logger.debug("DVP-SystemRegistry.HealthMonitor.GetNode - Success");
                        res.end('{}');
                    }

                }
            });

        }
        else
        {
            logger.warn("DVP-SystemRegistry.HealthMonitor.Node - UUID not found");
            var respMsg = msg.FormatMessage(new Error('UUID missing in document'), "Save Node Health Monitor Fail", false, undefined);
            res.end(respMsg);
        }


    }
    catch(ex)
    {
        logger.warn("DVP-SystemRegistry.HealthMonitor.Node - Exception occurred");
        var respMsg = msg.FormatMessage(ex, "Save Node Health Monitor Fail", false, undefined);
        res.end(respMsg);
    }

    return next();


});






server.get('/DVP/API/:version/SystemRegistry/Cluster', function(req, res, next)
{

    logger.debug("DVP-SystemRegistry.GetCluster HTTP  ");


    dbModel.SwarmCluster.findAll({include: [{model: dbModel.SwarmNode, as: "SwarmNode", include: [{model: dbModel.SwarmDockerInstance, as :"SwarmDockerInstance"}]}]})
        .then(function (cluster)
        {

            logger.debug("DVP-SystemRegistry.GetCluster Found ");
            var instance = msg.FormatMessage(undefined, "Get GetCluster done", true, cluster);
            res.write(instance);

            res.end();

            logger.debug("DVP-SystemRegistry.GetCluster - Response : " + instance);

        }).catch(function(err)
        {
            logger.error("DVP-SystemRegistry.GetCluster Failed", err);

            var instance = msg.FormatMessage(err, "Get Cluster failed", false, undefined);
            res.write(instance);
            res.end();

            logger.debug("DVP-SystemRegistry.GetCluster - Response : " + instance);
        });

    return next();


});

server.get('/DVP/API/:version/SystemRegistry/ClusterByToken/:token', function(req, res, next)
{

    logger.debug("DVP-SystemRegistry.GetClusterByToken HTTP");


    dbModel.SwarmCluster.find({where: {Token: req.params.token}, include: [{model: dbModel.SwarmNode, as: "SwarmNode", include: [{model: dbModel.SwarmDockerInstance, as :"SwarmDockerInstance", include : [{model: dbModel.SwarmDockerEnvVariable, as: "Envs"}]}]}]})
        .then(function (templateInstance)
        {
            try
            {

                logger.debug("DVP-SystemRegistry.GetClusterByToken %s Found",req.params.token);

                var instance = msg.FormatMessage(undefined, "Get ClusterByToken done", true, templateInstance);

                res.write(instance);
                res.end();

                logger.debug("DVP-SystemRegistry.GetClusterByToken - Response : " + instance);

            }
            catch(exp)
            {
                var instance = msg.FormatMessage(exp, "Error occurred", true, undefined);
                res.write(instance);
                res.end();
                logger.debug("DVP-SystemRegistry.GetClusterByToken - Response : " + instance);
            }

    }).catch(function(err)
        {
            logger.error("DVP-SystemRegistry.GetClusterByToken Failed", err);

            var instance = msg.FormatMessage(err, "Get ClusterByToken failed", false, undefined);
            res.write(instance);
            res.end();
            logger.debug("DVP-SystemRegistry.GetClusterByToken - Response : " + instance);
        });

    return next();

});

server.post('/DVP/API/:version/SystemRegistry/Cluster', function(req, res, next){

    var templateData=req.body;
    var status = false;

    if(templateData)
    {

        var cluster = dbModel.SwarmCluster.build({

            Name:  templateData.Name,
            Token:  templateData.Token,
            Code: templateData.Code,
            Company: 1,
            Tenant:1,
            Class: templateData.Class,
            Type: templateData.Type,
            Category: templateData.Category,
            LBDomain:templateData.Domain,
            LBIP:templateData.LBIP

        });

        cluster.save()
            .then(function (rslt)
            {
                logger.debug('DVP-SystemRegistry.CreateCluster PGSQL Cluster object saved successful ');
                status = true;

                var instance = msg.FormatMessage(undefined, "Store Cluster Done", status, rslt);
                res.write(instance);
                res.end();

                logger.debug("DVP-SystemRegistry.Createcluster - Response : " + instance);

            }).catch(function(err)
            {
                logger.error("DVP-SystemRegistry.CreateCluster PGSQL save failed ", err);

                var instance = msg.FormatMessage(err,"Store Cluster Failed", status,undefined);
                res.write(instance);
                res.end();

                logger.debug("DVP-SystemRegistry.Createcluster - Response : " + instance);

            });
    }
    else
    {

        logger.error("DVP-SystemRegistry.Createcluster Object Validation Failed");
        var instance = msg.FormatMessage(undefined,"Store cluster Object Validation Failed", status,undefined);
        res.write(instance);
        res.end();

        logger.debug("DVP-SystemRegistry.Createcluster - Response : " + instance);
    }


    return next();

});

server.put('/DVP/API/:version/SystemRegistry/Cluster/:token', function(req, res, next){});

server.del('/DVP/API/:version/SystemRegistry/Cluster/:token', function(req, res, next){});



////////////////////////////////////////////swarm node////////////////////////////////////////////////////
server.get('/DVP/API/:version/SystemRegistry/Nodes', function(req, res, next){


    logger.debug("DVP-SystemRegistry.GetNodes HTTP  ");


    dbModel.SwarmNode.findAll({include: [{model: dbModel.SwarmDockerInstance, as :"SwarmDockerInstance"}]})
        .then(function (node)
        {

            logger.debug("DVP-SystemRegistry.GetNodes Found ");

            var instance = msg.FormatMessage(undefined, "Get GetNode done", true, node);
            res.write(instance);

            res.end();

            logger.debug("DVP-SystemRegistry.GetNodes - Response : " + instance);

        }).catch(function(err)
        {
            logger.error("DVP-SystemRegistry.GetNodes Failed", err);

            var instance = msg.FormatMessage(err, "Get Node failed", false, undefined);
            res.write(instance);
            res.end();

            logger.debug("DVP-SystemRegistry.GetNodes - Response : " + instance);
        });

    return next();


});

server.get('/DVP/API/:version/SystemRegistry/Node/:uuid', function(req, res, next){


    logger.debug("DVP-SystemRegistry.GetNode HTTP  ");


    dbModel.SwarmNode.findAll({where: [{UUID: req.params.uuid}],include: [{model: dbModel.SwarmDockerInstance, as :"SwarmDockerInstance"}]})
        .then(function (node)
        {
            logger.debug("DVP-SystemRegistry.GetNode Found ");

            var instance = msg.FormatMessage(undefined, "Get NodeByName done", true, node);
            res.write(instance);

            res.end();
            logger.debug("DVP-SystemRegistry.GetNode - Response : " + instance);

        }).catch(function(err)
        {
            logger.error("DVP-SystemRegistry.GetNode Failed", err);

            var instance = msg.FormatMessage(err, "Get GetNode failed", false, undefined);
            res.write(instance);
            res.end();
            logger.debug("DVP-SystemRegistry.GetNode - Response : " + instance);
        });

    return next();

});

server.get('/DVP/API/:version/SystemRegistry/NodeByInstanceId/:uuid', function(req, res, next){


    logger.debug("DVP-SystemRegistry.NodeByInstanceId HTTP  ");


    dbModel.SwarmDockerInstance.find({where: [{UUID: req.params.uuid}],include: [{model: dbModel.SwarmNode, as :"SwarmNode"}]})
        .then(function (ins)
        {
            logger.debug("DVP-SystemRegistry.NodeByInstanceId Instance Found ");

            if(ins && ins.SwarmNode)
            {
                var instance = msg.FormatMessage(undefined, "Get NodeByInstanceId done", true, ins.SwarmNode);
                res.write(instance);

                res.end();
                logger.debug("DVP-SystemRegistry.NodeByInstanceId - Response : " + instance);
            }
            else
            {
                var instance = msg.FormatMessage(undefined, "Get NodeByInstanceId done", true, undefined);
                res.write(instance);

                res.end();
                logger.debug("DVP-SystemRegistry.NodeByInstanceId - Response : " + instance);
            }



        }).catch(function(err)
        {
            logger.error("DVP-SystemRegistry.NodeByInstanceId Failed", err);

            var instance = msg.FormatMessage(err, "Get NodeByInstanceId failed", false, undefined);
            res.write(instance);
            res.end();
            logger.debug("DVP-SystemRegistry.NodeByInstanceId - Response : " + instance);
        });

    return next();

});

server.post('/DVP/API/:version/SystemRegistry/Node', function(req, res, next)
{

    logger.debug("DVP-SystemRegistr.AddNode HTTP");

    var node=req.body;
    var status = false;
    if(node)
    {

        dbModel.SwarmCluster.find({where: [{ Token: node.ClusterToken}]})
            .then(function(cluster)
            {
                if(cluster)
                {

                    logger.debug("DVP-SystemRegistr.AddNode cluster Found ");

                var nodeInf = dbModel.SwarmNode.build({
                    UUID: node.UUID,
                    Name: node.Name,
                    Code: node.Code,
                    Company: 1,
                    Tenant: 1,
                    Class: node.Class,
                    Type: node.Type,
                    Category: node.Category,
                    MainIP: node.MainIP,
                    Domain: node.Domain,
                    RemotePort: node.RemotePort,
                    HostDomain: node.HostDomain

                });

                nodeInf
                    .save()
                    .then(function (rslt)
                    {

                            logger.debug("DVP-SystemRegistr.AddNode node Saved ");

                            cluster.addSwarmNode(nodeInf).then(function (clusterInstancex)
                            {

                                logger.debug("DVP-SystemRegistr.AddNode Node Set cluster");

                                status = true;

                                var instance = msg.FormatMessage(undefined, "Add Node", status, undefined);
                                res.write(instance);
                                res.end();
                                logger.debug("DVP-SystemRegistry.AddNode - Response : " + instance);


                            }).catch(function(err)
                            {
                                var instance = msg.FormatMessage(err, "Add Node", status, undefined);
                                res.write(instance);
                                res.end();

                                logger.error("DVP-SystemRegistr.AddNode Node Save Failed ",err);

                                logger.debug("DVP-SystemRegistry.AddNode - Response : " + instance);
                            });
                    }).catch(function(err)
                    {
                        var instance = msg.FormatMessage(err, "Add Node", status, undefined);
                        res.write(instance);
                        res.end();

                        logger.error("DVP-SystemRegistr.AddNode Node Save Failed ",err);

                        logger.debug("DVP-SystemRegistry.AddNode - Response : " + instance);

                    })
            }
            else
            {
                logger.error("DVP-SystemRegistr.AddNode Cluster NotFound ");
                var instance = msg.FormatMessage(undefined, "Add Node", status, undefined);
                res.write(instance);
                res.end();

                logger.debug("DVP-SystemRegistry.AddNode - Response : " + instance);

            }

        }).catch(function(err)
            {
                logger.error("DVP-SystemRegistr.AddNode exception ");
                var instance = msg.FormatMessage(err, "Add Node", status, undefined);
                res.write(instance);
                res.end();

                logger.debug("DVP-SystemRegistry.AddNode - Response : " + instance);
            })


    }
    else
    {

        var instance = msg.FormatMessage(undefined, "Add Node", status, undefined);
        res.write(instance);
        res.end();
        logger.debug("DVP-SystemRegistr.AddNode Object Validation Failed ");

        logger.debug("DVP-SystemRegistry.AddNode - Response : " + instance);

    }

    return next();

});

server.put('/DVP/API/:version/SystemRegistry/Node/:name', function(req, res, next)
{

});

server.del('/DVP/API/:version/SystemRegistry/Node/:name', function(req, res, next){});

//////////////////////////////////////////swarm node Presence//////////////////////////////////////////////



////////////////////////////////////////////swarm docker instances////////////////////////////////////////////////////
server.get('/DVP/API/:version/SystemRegistry/Instance', function(req, res, next)
{

    logger.debug("DVP-SystemRegistry.GetInstances HTTP  ");

    dbModel.SwarmDockerInstance.findAll().then(function (inst)
    {
        logger.debug("DVP-SystemRegistry.GetInstances Found ");

        var instance = msg.FormatMessage(undefined, "Get Instances done", true, inst);
        res.write(instance);

        res.end();

        logger.debug("DVP-SystemRegistry.GetInstances - Response : " + instance);

    }).catch(function(err)
    {
        logger.error("DVP-SystemRegistry.GetInstances Failed", err);

        var instance = msg.FormatMessage(err, "Get Instances failed", false, undefined);
        res.write(instance);
        res.end();

        logger.debug("DVP-SystemRegistry.GetInstances - Response : " + instance);
    });

    return next();

});

server.get('/DVP/API/:version/SystemRegistry/InstanceById/:id', function(req, res, next){


    logger.debug("DVP-SystemRegistry.GetInstanceById HTTP  ");

    dbModel.SwarmDockerInstance.find({where: [{UUID: req.params.id}]}).then(function (inst)
    {
        logger.debug("DVP-SystemRegistry.GetInstanceById Found ");

        var instance = msg.FormatMessage(undefined, "Get InstanceByID done", true, inst);
        res.write(instance);

        res.end();

        logger.debug("DVP-SystemRegistry.GetInstanceById - Response : " + instance);

    }).catch(function(err)
    {
        logger.error("DVP-SystemRegistry.GetInstanceById Failed", err);

        var instance = msg.FormatMessage(err, "GetInstanceById failed", false, undefined);
        res.write(instance);
        res.end();

        logger.debug("DVP-SystemRegistry.GetInstanceById" +
        "" +
        "" +
        " - Response : " + instance);
    });

    return next();

});

server.post('/DVP/API/:version/SystemRegistry/Instance', function(req, res, next)
{

    logger.debug("DVP-SystemRegistr.AddInstance HTTP");

    var instanceInfo = req.body;
    var status = false;

    if(instanceInfo)
    {

        dbModel.SwarmNode.find({where: [{ UUID: instanceInfo.SwarmNodeUuid}]}).then(function(nodeInfo)
        {
            if(nodeInfo)
            {
                logger.debug("DVP-SystemRegistr.AddInstance node Found");

                var inst = dbModel.SwarmDockerInstance.build({
                    Name: instanceInfo.Name,
                    ParentApp: instanceInfo.ParentAPP,
                    UUID: instanceInfo.UUID,
                    Code: instanceInfo.Code,
                    Company: 1,
                    Tenant: 1,
                    Class: instanceInfo.Class,
                    Type: instanceInfo.Type,
                    Category: instanceInfo.Category,
                    FrontEnd: instanceInfo.FrontEnd,
                    BackEnd: instanceInfo.BackEnd,
                    DeploymentUUID: instanceInfo.DeploymentUUID

                });

                inst
                    .save()
                    .then(function (rslt)
                    {

                            logger.debug("DVP-SystemRegistr.AddInstance instance Saved ");

                            nodeInfo.addSwarmDockerInstance(inst).then(function (rslt)
                            {

                                logger.debug("DVP-SystemRegistr.AddInstance Instance Set node");

                                if(instanceInfo.Envs)
                                {
                                    instanceInfo.Envs.forEach(function(envVar)
                                    {
                                        var swarmEnvVar = dbModel.SwarmDockerEnvVariable.build({
                                            Name: envVar.Name,
                                            Value: envVar.Value,
                                            Export: envVar.Export

                                        });

                                        swarmEnvVar
                                            .save()
                                            .then(function (rslt)
                                            {
                                                inst.addEnvs(swarmEnvVar).then(function(evRes)
                                                {

                                                }).catch(function(ex)
                                                {

                                                })

                                            }).catch(function(err)
                                            {

                                            })

                                    })
                                }

                                status = true;

                                var instance = msg.FormatMessage(undefined, "Add Instance", status, undefined);
                                res.write(instance);
                                res.end();

                                logger.debug("DVP-SystemRegistry.AddInstance - Response : " + instance);

                            })
                                .catch(function(err)
                                {
                                    var instance = msg.FormatMessage(err, "Add Instance Failed", status, undefined);
                                    res.write(instance);
                                    res.end();

                                    logger.error("DVP-SystemRegistr.AddInstance Instance Save Failed ",err);

                                    logger.debug("DVP-SystemRegistry.AddInstance - Response : " + instance);
                                });
                    }
                ).catch(function(err)
                    {
                        var instance = msg.FormatMessage(err, "Add Instance Failed", status, undefined);
                        res.write(instance);
                        res.end();

                        logger.error("DVP-SystemRegistr.AddInstance Instance Save Failed ",err);

                        logger.debug("DVP-SystemRegistry.AddInstance - Response : " + instance);
                    })
            }
            else
            {
                logger.error("DVP-SystemRegistr.AddInstance Node NotFound ");
                var instance = msg.FormatMessage(undefined, "Add Instance", status, undefined);
                res.write(instance);
                res.end();

                logger.debug("DVP-SystemRegistry.AddInstance - Response : " + instance);

            }

        }).catch(function(err)
        {
            logger.error("DVP-SystemRegistr.AddInstance - Exception occurred ", err);
            var instance = msg.FormatMessage(err, "Exception occurred", status, undefined);
            res.write(instance);
            res.end();

            logger.debug("DVP-SystemRegistry.AddInstance - Response : " + instance);
        })


    }
    else
    {

        logger.debug("DVP-SystemRegistr.AddInstance Instance info not supplied ");

        var instance = msg.FormatMessage(undefined, "Empty Body", status, undefined);
        res.write(instance);
        res.end();

        logger.debug("DVP-SystemRegistry.AddInstance - Response : " + instance);

    }

    return next();


});

server.put('/DVP/API/:version/SystemRegistry/Node/:uuid/Instance/:id/Status/:status', function(req, res, next)
{

    logger.debug("DVP-SystemRegistr.UpdateInstanceStatus HTTP");

    var instanceId = req.params.id;
    var status = req.params.status;

    try
    {
        dbModel.SwarmDockerInstance.find({where: [{UUID: instanceId}]})
            .then(function (instance)
            {
                if(instance)
                {
                    var updateData = {Status:status};

                    var deploymentUuid = instance.DeploymentUUID;

                    if(deploymentUuid)
                    {
                        instance.updateAttributes(updateData)
                            .then(function(updateData)
                            {

                                Model.findById({ _id: deploymentUuid }, function(err, node)
                                {
                                    if(err)
                                    {
                                        logger.error("DVP-SystemRegistry.HealthMonitor.GetNode - Error occurred", err);
                                        var respMsg = msg.FormatMessage(err, "Get Node Health Monitor Fail", false, undefined);
                                        res.end(respMsg);

                                        logger.debug("DVP-SystemRegistry.HealthMonitor.GetNode - Response : " + respMsg);
                                    }
                                    else
                                    {
                                        if(node)
                                        {

                                            var ins = underscore.find(node._doc.Instances, function (instnce)
                                            {
                                                return instnce.UUID == instanceId;
                                            });

                                            if (ins)
                                            {
                                                ins.Status = status;

                                                var newModel = new Model(node);

                                                Model.remove({_id: node._id}, function (err, remRslt)
                                                {
                                                    if (!err)
                                                    {
                                                        newModel.save(function (err, rslt)
                                                        {
                                                            if (err)
                                                            {
                                                                logger.error("DVP-SystemRegistry.HealthMonitor.Node - Error occurred", err);
                                                                var respMsg = msg.FormatMessage(err, "Save Node Health Monitor Fail", false, undefined);
                                                                res.end(respMsg);

                                                                logger.debug("DVP-SystemRegistry.HealthMonitor.GetNode - Response : " + respMsg);
                                                            }
                                                            else
                                                            {
                                                                logger.debug("DVP-SystemRegistry.HealthMonitor.Node - Success");
                                                                var respMsg = msg.FormatMessage(undefined, "Save Node Health Monitor Success", true, rslt);
                                                                res.end(respMsg);

                                                                logger.debug("DVP-SystemRegistry.HealthMonitor.GetNode - Response : " + respMsg);
                                                            }

                                                        })
                                                    }
                                                    else
                                                    {
                                                        logger.debug("DVP-SystemRegistry.HealthMonitor.Node - Fail");
                                                        var respMsg = msg.FormatMessage(err, "Save Node Health Monitor Fail", false, undefined);
                                                        res.end(respMsg);

                                                        logger.debug("DVP-SystemRegistry.HealthMonitor.GetNode - Response : " + respMsg);
                                                    }
                                                });


                                            }
                                            else
                                            {
                                                logger.debug("DVP-SystemRegistry.HealthMonitor.Node - Fail");
                                                var respMsg = msg.FormatMessage(new Error('Instance not found'), "Save Node Health Monitor Fail", false, undefined);
                                                res.end(respMsg);

                                                logger.debug("DVP-SystemRegistry.HealthMonitor.GetNode - Response : " + respMsg);
                                            }

                                        }
                                        else
                                        {
                                            logger.debug("DVP-SystemRegistry.HealthMonitor.Node - Fail");
                                            var respMsg = msg.FormatMessage(new Error('Node not found'), "Save Node Health Monitor Fail", false, undefined);
                                            res.end(respMsg);

                                            logger.debug("DVP-SystemRegistry.HealthMonitor.GetNode - Response : " + respMsg);
                                        }

                                    }
                                });

                            })
                            .catch(function(err)
                            {
                                var instance = msg.FormatMessage(err, "Update Instance State", false, undefined);
                                res.write(instance);
                                res.end();

                                logger.debug("DVP-SystemRegistry.HealthMonitor.GetNode - Response : " + instance);
                            })
                    }
                    else
                    {
                        var instance = msg.FormatMessage(new Error('Deployment uuid not found'), "Update Instance State", false, undefined);
                        res.write(instance);
                        res.end();

                        logger.debug("DVP-SystemRegistry.HealthMonitor.GetNode - Response : " + instance);
                    }


                }
                else
                {
                    var instance = msg.FormatMessage(new Error('Instance not found'), "Update Instance State", false, undefined);
                    res.write(instance);
                    res.end();

                    logger.debug("DVP-SystemRegistry.HealthMonitor.GetNode - Response : " + instance);
                }
            })
            .catch(function(err)
            {
                var instance = msg.FormatMessage(err, "Update Instance State", false, undefined);
                res.write(instance);
                res.end();

                logger.debug("DVP-SystemRegistry.HealthMonitor.GetNode - Response : " + instance);
            });
    }
    catch(ex)
    {
        var instance = msg.FormatMessage(err, "Update Instance State", false, undefined);
        res.write(instance);
        res.end();

        logger.debug("DVP-SystemRegistry.HealthMonitor.GetNode - Response : " + instance);
    }

    return next();
});

server.del('/DVP/API/:version/SystemRegistry/Node/:uuid/Instance/:id', function(req, res, next)
{
    try
    {
        var instanceId = req.params.id;

        logger.debug('[DVP-SystemRegistry.DeleteInstanceByID] - HTTP Request Received - Req Params - InstanceId : %s', instanceId);

        if(instanceId)
        {
            dbModel.SwarmDockerInstance.find({where: [{UUID: instanceId}]}).then(function (instance)
            {
                if (instance)
                {
                    logger.debug("[DVP-SystemRegistry.DeleteInstanceByID] - Instance found");

                    var deploymentUUID = instance.DeploymentUUID;

                    if(deploymentUUID)
                    {
                        instance.destroy().then(function (result)
                        {
                            Model.findById({ _id: deploymentUUID }, function(err, node)
                            {
                                if(err)
                                {
                                    logger.error("DVP-SystemRegistry.HealthMonitor.GetNode - Error occurred", err);
                                    var respMsg = msg.FormatMessage(err, "Get Node Health Monitor Fail", false, undefined);
                                    res.end(respMsg);
                                }
                                else
                                {
                                    if(node)
                                    {
                                        var itemToRemove = -1;
                                        for(var i = 0; i < node._doc.Instances.length; i++)
                                        {
                                            if(node._doc.Instances[i].UUID === instanceId)
                                            {
                                                node._doc.Instances.splice(i, 1);
                                                itemToRemove = i;
                                                break;
                                            }
                                        }

                                        if(itemToRemove > -1)
                                        {
                                            var newModel = new Model(node);

                                            Model.remove({ _id: swarmNodeUuid }, function(err, remRslt)
                                            {
                                                if(!err)
                                                {
                                                    newModel.save(function(err, rslt)
                                                    {
                                                        if(err)
                                                        {
                                                            logger.error("DVP-SystemRegistry.HealthMonitor.Node - Error occurred", err);
                                                            var respMsg = msg.FormatMessage(err, "Save Node Health Monitor Fail", false, undefined);
                                                            res.end(respMsg);
                                                        }
                                                        else
                                                        {
                                                            logger.debug("DVP-SystemRegistry.HealthMonitor.Node - Success");
                                                            var respMsg = msg.FormatMessage(undefined, "Save Node Health Monitor Success", true, rslt);
                                                            res.end(respMsg);
                                                        }

                                                    })
                                                }
                                                else
                                                {
                                                    logger.debug("DVP-SystemRegistry.HealthMonitor.Node - Fail");
                                                    var respMsg = msg.FormatMessage(err, "Save Node Health Monitor Fail", false, undefined);
                                                    res.end(respMsg);
                                                }
                                            });


                                        }
                                        else
                                        {
                                            logger.debug("DVP-SystemRegistry.HealthMonitor.Node - Fail");
                                            var respMsg = msg.FormatMessage(new Error('Instance not found'), "Save Node Health Monitor Fail", false, undefined);
                                            res.end(respMsg);
                                        }

                                    }
                                    else
                                    {
                                        logger.debug("DVP-SystemRegistry.HealthMonitor.Node - Fail");
                                        var respMsg = msg.FormatMessage(new Error('Node not found'), "Save Node Health Monitor Fail", false, undefined);
                                        res.end(respMsg);
                                    }



                                }
                            });


                        }).catch(function(err)
                        {
                            logger.error("[DVP-SystemRegistry.DeleteInstanceByID] - Error deleting", err);

                            var respRes = msg.FormatMessage(err, "Instance delete error", false, undefined);
                            res.end(respRes);
                        });
                    }
                    else
                    {
                        logger.debug("DVP-SystemRegistry.HealthMonitor.Node - Fail");
                        var respMsg = msg.FormatMessage(new Error('Deployment UUID not found'), "Save Node Health Monitor Fail", false, undefined);
                        res.end(respMsg);
                    }


                }
                else
                {
                    logger.warn("[DVP-SystemRegistry.DeleteInstanceByID] - Instance with id not found");

                    var respRes = msg.FormatMessage(new Error("Instance with id not found"), "Instance with id not found", false, undefined);
                    res.end(respRes);
                }

            }).catch(function(err)
            {
                logger.error("[DVP-SystemRegistry.DeleteInstanceByID] - Error getting instance", err);

                var respRes = msg.FormatMessage(err, "Error getting instance", false, undefined);
                res.end(respRes);
            })

        }
        else
        {
            logger.warn("[DVP-SystemRegistry.DeleteInstanceByID] - Instance with id not found");

            var respRes = msg.FormatMessage(new Error("Instance id not provided"), "Instance id not provided", false, undefined);
            res.end(respRes);

        }

    }
    catch(ex)
    {
        logger.error("[DVP-SystemRegistry.DeleteInstanceByID] - Exception occurred", ex);

        var respRes = msg.FormatMessage(ex, "Exception occurred", false, undefined);
        res.end(respRes);

    }
    return next();
});

server.put('/DVP/API/:version/SystemRegistry/Instance/:id', function(req, res, next){});

server.del('/DVP/API/:version/SystemRegistry/Cluster/:id', function(req, res, next){});




///////////////////////////////////////////////////////////////////////////////////////////////////////

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