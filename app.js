var restify = require('restify');
var config = require('config');
var stringify = require('stringify');
var sysRegBackendHandler = require('./SysRegBackendHandler.js');
var dbModel = require('DVP-DBModels');
var nodeUuid = require('node-uuid');
var logger = require('DVP-Common/LogHandler/CommonLogHandler.js').logger;
var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');

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




server.listen(hostPort, hostIp, function () {
    console.log('%s listening at %s', server.name, server.url);
});