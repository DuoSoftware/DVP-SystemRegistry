var dbModel = require('dvp-dbmodels');

var GetBaseServiceDetails = function(reqId, callback)
{
    try
    {
        dbModel.BaseService.findAll()
            .then(function ( baseServiceList)
            {

                    logger.debug('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query success', reqId);

                callback(undefined, baseServiceList);
            }).catch(function(err){

                logger.error('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query failed', reqId, err);
                callback(err, undefined);
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
            .then(function (extServiceList)
            {



                    logger.debug('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query success', reqId);

                callback(undefined, extServiceList);
            }).catch(function(err){

                logger.error('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query failed', reqId, err);
                callback(err, undefined);

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
            .then(function (attServiceList)
            {


                logger.debug('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query success', reqId);
                callback(undefined, attServiceList);


            }).catch(function(err){

                logger.error('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query failed', reqId, err);
                callback(err, undefined);

            });

    }
    catch(ex)
    {
        callback(ex, {});
    }
};

var GetServiceRegistryDeploymentInfo = function(reqId, serviceName, callback)
{
    try
    {
        dbModel.ServiceDeploymentDistribution.findAll({where: [{ServiceName: serviceName}]})
            .then(function ( serviceInfoList)
            {

                logger.debug('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query success', reqId);
                callback(undefined, serviceInfoList);


            }).catch(function(err){

                logger.error('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query failed', reqId, err);
                callback(err, undefined);

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
                .then(function (baseService) {
                    if (!baseService) {

                        //logger.error('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query failed', reqId, err);
                        //callback(err, false);
                    logger.debug('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query success', reqId);
                    callback(new Error('Base service not found'), false);

                    }
                    else {
                        dbModel.AttachedService.find({where: [{id: attachedServiceId}]})
                            .then(function (attService) {
                                if (!attService) {

                                    //callback(err, false);
                                    //logger.error('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query failed', reqId, err);

                                    logger.debug('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query success', reqId);

                                    callback(new Error('attached service not found'), false);
                                }
                                else {
                                    baseService.addAttachedService(attService).then(function (result) {

                                            callback(undefined, true);


                                    }).catch(function(err){

                                        callback(err, false);
                                        logger.error('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query failed', reqId, err);



                                    });
                                }

                            }).catch(function(err){

                                callback(err, false);
                                logger.error('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query failed', reqId, err);


                            });
                    }

                }).catch(function(err){

                    logger.error('[DVP-SystemRegistry.GetBaseServiceDetails] - [%s] - PGSQL query failed', reqId, err);
                    callback(err, false);

                });

        }

    }
    catch(ex)
    {
        callback(ex, false);
    }
};

var AddExtendedServiceToAttached = function(reqId, extServiceId, attachedServiceId, callback)
{
    try
    {
        dbModel.ExtendedService.find({where: [{id: extServiceId}]})
            .then(function ( extService)
            {
                if(!extService)
                {

                    logger.debug('[DVP-SystemRegistry.AddExtendedServiceToAttached] - [%s] - PGSQL query success', reqId);
                    callback(new Error('No Extended service found'), false);
                }
                else
                {
                    dbModel.AttachedService.find({where: [{id: attachedServiceId}]})
                        .then(function (attService)
                        {
                            if(!attService)
                            {

                                logger.debug('[DVP-SystemRegistry.AddExtendedServiceToAttached] - [%s] - PGSQL query success No item found', reqId);
                                callback(new Error('No attached service found'), false);
                            }
                            else
                            {
                                extService.addAttachedService(attService).then(function (result)
                                {

                                    logger.debug('[DVP-SystemRegistry.AddExtendedServiceToAttached] - [%s] - PGSQL query success', reqId);
                                    callback(undefined, true);


                                }).catch(function(err){

                                    logger.error('[DVP-SystemRegistry.AddExtendedServiceToAttached] - [%s] - PGSQL query failed', reqId, err);
                                    callback(err, false);


                                });
                            }

                        }).catch(function(err){

                            logger.error('[DVP-SystemRegistry.AddExtendedServiceToAttached] - [%s] - PGSQL query failed', reqId, err);
                            callback(err, false);


                        });
                }

            }).catch(function(err){

                logger.error('[DVP-SystemRegistry.AddExtendedServiceToAttached] - [%s] - PGSQL query failed', reqId, err);
                callback(err, false);

            });

    }
    catch(ex)
    {
        callback(ex, false);
    }
};

var AddBaseServiceToExtended = function(reqId, baseServiceId, extendedServiceId, callback)
{
    try
    {
        dbModel.BaseService.find({where: [{id: baseServiceId}]})
            .then(function (baseService)
            {
                if(!baseService)
                {

                    logger.debug('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - PGSQL query success', reqId);
                    callback(new Error('Base service not found'), false);
                }
                else
                {
                    dbModel.ExtendedService.find({where: [{id: extendedServiceId}]})
                        .then(function (extService)
                        {
                            if(!extService)
                            {
                                logger.debug('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - PGSQL query success no extended item found', reqId);
                                callback(new Error('Extended service not found'), false);
                            }
                            else
                            {
                                extService.addBaseService(baseService).then(function (result)
                                {

                                    logger.debug('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - PGSQL query success', reqId);
                                    callback(undefined, true);



                                }).catch(function(err){


                                    logger.error('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - PGSQL query failed', reqId, err);
                                    callback(err, false);

                                });
                            }

                        }).catch(function(err){

                            logger.error('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - PGSQL query failed', reqId, err);
                            callback(err, false);

                        });
                }

            }).catch(function(err){


                logger.error('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - PGSQL query failed', reqId, err);
                callback(err, false);

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
            .then(function (item) {
                try {


                        logger.debug('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - PGSQL query success', reqId);
                        callback(undefined, true);

                }
                catch (ex)
                {
                    callback(ex, false);
                }

            }).catch(function(err){


                logger.error('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - PGSQL query failed', reqId, err);
                callback(err, false);

            });
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
            .then(function ( serviceInfo)
            {

                logger.debug('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - PGSQL query success', reqId);
                callback(undefined, serviceInfo);
            }).catch(function(err){

                logger.error('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - PGSQL query failed', reqId, err);
                callback(err, undefined);

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
            .then(function (serviceInfo)
            {

                logger.debug('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - PGSQL query success', reqId);
                callback(undefined, serviceInfo);

            }).catch(function(err){

                logger.error('[DVP-SystemRegistry.AddBaseServiceToExtended] - [%s] - PGSQL query failed', reqId, err);
                callback(err, undefined);

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