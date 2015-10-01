var dbModel = require('dvp-dbmodels');

var GetBaseServiceDetails = function(reqId, callback)
{
    try
    {
        dbModel.BaseService.findAll()
            .complete(function (err, baseServiceList)
            {
                if(err)
                {
                    logger.error('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query failed', reqId, err);
                }
                else
                {
                    logger.debug('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query success', reqId);
                }
                callback(err, baseServiceList);
            });

    }
    catch(ex)
    {
        callback(ex, []);
    }
};

var GetExtendedServiceDetails = function(reqId, callback)
{
    try
    {
        dbModel.ExtendedService.findAll()
            .complete(function (err, extServiceList)
            {
                if(err)
                {
                    logger.error('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query failed', reqId, err);
                }
                else
                {
                    logger.debug('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query success', reqId);
                }
                callback(err, extServiceList);
            });

    }
    catch(ex)
    {
        callback(ex, []);
    }
};

var GetAttachedServiceDetails = function(reqId, callback)
{
    try
    {
        dbModel.AttachedService.findAll()
            .complete(function (err, attServiceList)
            {
                if(err)
                {
                    logger.error('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query failed', reqId, err);
                }
                else
                {
                    logger.debug('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query success', reqId);
                }
                callback(err, attServiceList);
            });

    }
    catch(ex)
    {
        callback(ex, []);
    }
};

var GetServiceRegistryDeploymentInfo = function(reqId, serviceName, callback)
{
    try
    {
        dbModel.ServiceDeploymentDistribution.findAll({where: [{ServiceName: serviceName}]})
            .complete(function (err, serviceInfoList)
            {
                if(err)
                {
                    logger.error('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query failed', reqId, err);
                }
                else
                {
                    logger.debug('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query success', reqId);
                }
                callback(err, serviceInfoList);
            });

    }
    catch(ex)
    {
        callback(ex, undefined);
    }
}

var AddBaseServiceToAttached = function(reqId, baseServiceId, attachedServiceId, callback)
{
    try
    {
        {
            dbModel.BaseService.find({where: [{id: baseServiceId}]})
                .complete(function (err, baseService) {
                    if (err && !baseService) {
                        if (err) {
                            logger.error('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query failed', reqId, err);
                        }
                        else {
                            logger.debug('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query success', reqId);
                        }
                        callback(err, false);
                    }
                    else {
                        dbModel.AttachedService.find({where: [{id: attachedServiceId}]})
                            .complete(function (err, attService) {
                                if (err && !attService) {
                                    if (err) {
                                        logger.error('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query failed', reqId, err);
                                    }
                                    else {
                                        logger.debug('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query success', reqId);
                                    }
                                    callback(err, false);
                                }
                                else {
                                    baseService.addAttachedService(attService).complete(function (err, result) {
                                        if (!err) {
                                            callback(undefined, true);
                                        }
                                        else {
                                            if (err) {
                                                logger.error('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query failed', reqId, err);
                                            }
                                            else {
                                                logger.debug('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query success', reqId);
                                            }
                                            callback(err, true);
                                        }

                                    });
                                }

                            });
                    }

                });

        }

    }
    catch(ex)
    {
        callback(ex, true);
    }
};

var AddExtendedServiceToAttached = function(reqId, extServiceId, attachedServiceId, callback)
{
    try
    {
        dbModel.ExtendedService.find({where: [{id: extServiceId}]})
            .complete(function (err, extService)
            {
                if(err && !extService)
                {
                    if(err)
                    {
                        logger.error('[DVP-SystemRegistry.AddExtendedServiceToAttached] - [%s] - PGSQL query failed', reqId, err);
                    }
                    else
                    {
                        logger.debug('[DVP-SystemRegistry.AddExtendedServiceToAttached] - [%s] - PGSQL query success', reqId);
                    }
                    callback(err, false);
                }
                else
                {
                    dbModel.AttachedService.find({where: [{id: attachedServiceId}]})
                        .complete(function (err, attService)
                        {
                            if(err && !attService)
                            {
                                if(err)
                                {
                                    logger.error('[DVP-SystemRegistry.AddExtendedServiceToAttached] - [%s] - PGSQL query failed', reqId, err);
                                }
                                else
                                {
                                    logger.debug('[DVP-SystemRegistry.AddExtendedServiceToAttached] - [%s] - PGSQL query success', reqId);
                                }
                                callback(err, false);
                            }
                            else
                            {
                                extService.addAttachedService(attService).complete(function (err, result)
                                {
                                    if(!err)
                                    {
                                        callback(undefined, true);
                                    }
                                    else
                                    {
                                        if(err)
                                        {
                                            logger.error('[DVP-SystemRegistry.AddExtendedServiceToAttached] - [%s] - PGSQL query failed', reqId, err);
                                        }
                                        else
                                        {
                                            logger.debug('[DVP-SystemRegistry.AddExtendedServiceToAttached] - [%s] - PGSQL query success', reqId);
                                        }
                                        callback(err, true);
                                    }

                                });
                            }

                        });
                }

            });

    }
    catch(ex)
    {
        callback(ex, true);
    }
};

var AddBaseServiceToExtended = function(reqId, baseServiceId, extendedServiceId, callback)
{
    try
    {
        dbModel.BaseService.find({where: [{id: baseServiceId}]})
            .complete(function (err, baseService)
            {
                if(err && !baseService)
                {
                    if(err)
                    {
                        logger.error('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - PGSQL query failed', reqId, err);
                    }
                    else
                    {
                        logger.debug('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - PGSQL query success', reqId);
                    }
                    callback(err, false);
                }
                else
                {
                    dbModel.ExtendedService.find({where: [{id: extendedServiceId}]})
                        .complete(function (err, extService)
                        {
                            if(err && !extService)
                            {
                                if(err)
                                {
                                    logger.error('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - PGSQL query failed', reqId, err);
                                }
                                else
                                {
                                    logger.debug('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - PGSQL query success', reqId);
                                }
                                callback(err, false);
                            }
                            else
                            {
                                extService.addBaseService(baseService).complete(function (err, result)
                                {
                                    if(!err)
                                    {
                                        callback(undefined, true);
                                    }
                                    else
                                    {
                                        if(err)
                                        {
                                            logger.error('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - PGSQL query failed', reqId, err);
                                        }
                                        else
                                        {
                                            logger.debug('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - PGSQL query success', reqId);
                                        }
                                        callback(err, true);
                                    }

                                });
                            }

                        });
                }

            });

    }
    catch(ex)
    {
        callback(ex, true);
    }
};

var AddSystemService = function(reqId, serviceInfo, callback)
{
    try
    {
        serviceInfo
            .save()
            .complete(function (err) {
                try {
                    if (err)
                    {
                        if(err)
                        {
                            logger.error('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - PGSQL query failed', reqId, err);
                        }
                        else
                        {
                            logger.debug('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - PGSQL query success', reqId);
                        }
                        callback(err, false);
                    }
                    else
                    {
                        callback(undefined, true);
                    }
                }
                catch (ex)
                {
                    callback(ex, false);
                }

            })
    }
    catch(ex)
    {
        callback(ex, false);
    }

};

var GetBaseServiceDetailsById = function(reqId, baseServiceId, callback)
{
    try
    {
        dbModel.BaseService.find({where: [{id: baseServiceId}], include : [{model: dbModel.AttachedService, as: "AttachedService"}]})
            .complete(function (err, serviceInfo)
            {
                if(err)
                {
                    logger.error('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - PGSQL query failed', reqId, err);
                }
                else
                {
                    logger.debug('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - PGSQL query success', reqId);
                }
                callback(err, serviceInfo);
            });

    }
    catch(ex)
    {
        callback(ex, undefined);
    }

};

var GetExtendedServiceDetailsById = function(reqId, extServiceId, callback)
{
    try
    {
        dbModel.ExtendedService.find({where: [{id: extServiceId}], include : [{model: dbModel.BaseService, as: "BaseService"}], include: [{model: dbModel.AttachedService, as: "AttachedService"}]})
            .complete(function (err, serviceInfo)
            {
                if(err)
                {
                    logger.error('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - PGSQL query failed', reqId, err);
                }
                else
                {
                    logger.debug('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - PGSQL query success', reqId);
                }
                callback(err, serviceInfo);
            });

    }
    catch(ex)
    {
        callback(ex, undefined);
    }

};


module.exports.GetBaseServiceDetails = GetBaseServiceDetails;
module.exports.GetExtendedServiceDetails = GetExtendedServiceDetails;
module.exports.GetAttachedServiceDetails = GetAttachedServiceDetails;
module.exports.GetBaseServiceDetailsById = GetBaseServiceDetailsById;
module.exports.AddSystemService = AddSystemService;
module.exports.AddBaseServiceToExtended = AddBaseServiceToExtended;
module.exports.GetExtendedServiceDetailsById = GetExtendedServiceDetailsById;
module.exports.AddBaseServiceToAttached = AddBaseServiceToAttached;
module.exports.AddExtendedServiceToAttached = AddExtendedServiceToAttached;
module.exports.GetServiceRegistryDeploymentInfo = GetServiceRegistryDeploymentInfo;