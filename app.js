var restify = require('restify');
var config = require('config');
var stringify = require('stringify');
var sysRegBackendHandler = require('./SysRegBackendHandler.js');
var dbModel = require('DVP-DBModels');

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
    try
    {
        var serviceRegInfo = {};
        sysRegBackendHandler.GetBaseServiceDetails(function (err, result)
        {
            if (err || !result)
            {
                res.end('{}');
            }
            else
            {
                serviceRegInfo.BaseServiceInfo = result;

                sysRegBackendHandler.GetExtendedServiceDetails(function (err, result)
                {
                    if (err || !result)
                    {
                        var jsonStr = JSON.stringify(serviceRegInfo);
                        res.end(jsonStr);
                    }
                    else
                    {
                        serviceRegInfo.ExtendedServiceInfo = result;

                        sysRegBackendHandler.GetAttachedServiceDetails(function (err, result)
                        {
                            if (err || !result)
                            {
                                var jsonStr = JSON.stringify(serviceRegInfo);
                                res.end(jsonStr);
                            }
                            else
                            {
                                serviceRegInfo.AttachedServiceInfo = result;

                                var jsonStr = JSON.stringify(serviceRegInfo);
                                res.end(jsonStr);
                            }
                        });
                    }
                });
            }
        });
    }
    catch(ex)
    {
        res.end('{}');
    }

    return next();

});

server.get('/DVP/API/' + hostVersion + '/SystemRegistry/GetBaseServiceById/:id', function(req, res, next)
{
    try
    {
        var id = req.params.id;

        sysRegBackendHandler.GetBaseServiceDetailsById(id, function (err, result)
        {
            if (err || !result)
            {
                res.end('{}');
            }
            else
            {
                var baseServiceInfo = JSON.stringify(result);
                res.end(baseServiceInfo);
            }
        });
    }
    catch(ex)
    {
        res.end('{}');
    }

    return next();

});

server.get('/DVP/API/' + hostVersion + '/SystemRegistry/GetExtendedServiceById/:id', function(req, res, next)
{
    try
    {
        var id = req.params.id;

        sysRegBackendHandler.GetExtendedServiceDetailsById(id, function (err, result)
        {
            if (err || !result)
            {
                res.end('{}');
            }
            else
            {
                var extServiceInfo = JSON.stringify(result);
                res.end(extServiceInfo);
            }
        });
    }
    catch(ex)
    {
        res.end('{}');
    }

    return next();

});

server.get('/DVP/API/' + hostVersion + '/RegistryInfo/GetRegistryInfoByName/:serviceName', function(req, res, next)
{
    try
    {
        var serviceName = req.params.serviceName;

        sysRegBackendHandler.GetServiceRegistryDeploymentInfo(serviceName, function (err, result)
        {
            if (err || !result)
            {
                res.end('{}');
            }
            else
            {
                var extServiceInfo = JSON.stringify(result);
                res.end(extServiceInfo);
            }
        });
    }
    catch(ex)
    {
        res.end('');
    }

    return next();

});

server.post('/DVP/API/' + hostVersion + '/RegistryInfo/AddBaseService', function(req, res, next)
{
    try
    {
        var baseServiceInfo = req.body;

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

        sysRegBackendHandler.AddSystemService(baseService, function (err, result)
        {
            if (err || !result)
            {
                res.end('{}');
            }
            else
            {
                var rslt = JSON.stringify(result);
                res.end(rslt);
            }
        });
    }
    catch(ex)
    {
        res.end('');
    }

    return next();

});

server.post('/DVP/API/' + hostVersion + '/RegistryInfo/AddExtendedService', function(req, res, next)
{
    try
    {
        var extServiceInfo = req.body;

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

        sysRegBackendHandler.AddSystemService(extService, function (err, result)
        {
            if (err || !result)
            {
                res.end('{}');
            }
            else
            {
                var rslt = JSON.stringify(result);
                res.end(rslt);
            }
        });
    }
    catch(ex)
    {
        res.end('');
    }

    return next();

});

server.post('/DVP/API/' + hostVersion + '/RegistryInfo/AddAttachedService', function(req, res, next)
{
    try
    {
        var attServiceInfo = req.body;

        var attService = dbModel.AttachedService.build({
            AttServiceName: attServiceInfo.AttServiceName,
            Description: attServiceInfo.Description,
            ObjClass: attServiceInfo.ObjClass,
            ObjType: attServiceInfo.ObjType,
            ObjCategory: attServiceInfo.ObjCategory
        });

        sysRegBackendHandler.AddSystemService(attService, function (err, result)
        {
            if (err || !result)
            {
                res.end('{}');
            }
            else
            {
                var rslt = JSON.stringify(result);
                res.end(rslt);
            }
        });
    }
    catch(ex)
    {
        res.end('');
    }

    return next();

});

server.post('/DVP/API/' + hostVersion + '/RegistryInfo/AddAttachedServiceToBase/:baseId/:attId', function(req, res, next)
{
    try
    {
        var baseId = req.params.baseId;
        var attId = req.params.attId;

        sysRegBackendHandler.AddBaseServiceToAttached(baseId, attId, function (err, result)
        {
            if (err || !result)
            {
                res.end('{}');
            }
            else
            {
                var rslt = JSON.stringify(result);
                res.end(rslt);
            }
        });
    }
    catch(ex)
    {
        res.end('');
    }

    return next();

});

server.post('/DVP/API/' + hostVersion + '/RegistryInfo/AddAttachedServiceToExtended/:extId/:attId', function(req, res, next)
{
    try
    {
        var extId = req.params.extId;
        var attId = req.params.attId;

        sysRegBackendHandler.AddExtendedServiceToAttached(extId, attId, function (err, result)
        {
            if (err || !result)
            {
                res.end('{}');
            }
            else
            {
                var rslt = JSON.stringify(result);
                res.end(rslt);
            }
        });
    }
    catch(ex)
    {
        res.end('');
    }

    return next();

});

server.post('/DVP/API/' + hostVersion + '/RegistryInfo/AddBaseServiceToExtended/:baseId/:extId', function(req, res, next)
{
    try
    {
        var extId = req.params.extId;
        var baseId = req.params.baseId;

        sysRegBackendHandler.AddBaseServiceToExtended(baseId, extId, function (err, result)
        {
            if (err || !result)
            {
                res.end('{}');
            }
            else
            {
                var rslt = JSON.stringify(result);
                res.end(rslt);
            }
        });
    }
    catch(ex)
    {
        res.end('');
    }

    return next();

});




server.listen(hostPort, hostIp, function () {
    console.log('%s listening at %s', server.name, server.url);
});