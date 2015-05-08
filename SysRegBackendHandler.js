var dbModel = require('DVP-DBModels');

var GetBaseServiceDetails = function(callback)
{
    try
    {
        dbModel.BaseService.findAll()
            .complete(function (err, baseServiceList)
            {
                callback(err, baseServiceList);
            });

    }
    catch(ex)
    {
        callback(ex, []);
    }
};

var GetExtendedServiceDetails = function(callback)
{
    try
    {
        dbModel.ExtendedService.findAll()
            .complete(function (err, extServiceList)
            {
                callback(err, extServiceList);
            });

    }
    catch(ex)
    {
        callback(ex, []);
    }
};

var GetAttachedServiceDetails = function(callback)
{
    try
    {
        dbModel.AttachedService.findAll()
            .complete(function (err, attServiceList)
            {
                callback(err, attServiceList);
            });

    }
    catch(ex)
    {
        callback(ex, []);
    }
};

var GetServiceRegistryDeploymentInfo = function(serviceName, callback)
{
    try
    {
        dbModel.ServiceDeploymentDistribution.findAll({where: [{ServiceName: serviceName}]})
            .complete(function (err, serviceInfoList)
            {
                callback(err, serviceInfoList);
            });

    }
    catch(ex)
    {
        callback(ex, undefined);
    }
}

var AddBaseServiceToAttached = function(baseServiceId, attachedServiceId, callback)
{
    try
    {
        dbModel.BaseService.find({where: [{id: baseServiceId}]})
            .complete(function (err, baseService)
            {
                if(err && !baseService)
                {
                    callback(err, false);
                }
                else
                {
                    dbModel.AttachedService.find({where: [{id: attachedServiceId}]})
                        .complete(function (err, attService)
                        {
                            if(err && !attService)
                            {
                                callback(err, false);
                            }
                            else
                            {
                                baseService.addAttachedService(attService).complete(function (err, result)
                                {
                                    if(!err)
                                    {
                                        callback(undefined, true);
                                    }
                                    else
                                    {
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

var AddExtendedServiceToAttached = function(extServiceId, attachedServiceId, callback)
{
    try
    {
        dbModel.ExtendedService.find({where: [{id: extServiceId}]})
            .complete(function (err, extService)
            {
                if(err && !extService)
                {
                    callback(err, false);
                }
                else
                {
                    dbModel.AttachedService.find({where: [{id: attachedServiceId}]})
                        .complete(function (err, attService)
                        {
                            if(err && !attService)
                            {
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

var AddBaseServiceToExtended = function(baseServiceId, extendedServiceId, callback)
{
    try
    {
        dbModel.BaseService.find({where: [{id: baseServiceId}]})
            .complete(function (err, baseService)
            {
                if(err && !baseService)
                {
                    callback(err, false);
                }
                else
                {
                    dbModel.ExtendedService.find({where: [{id: extendedServiceId}]})
                        .complete(function (err, extService)
                        {
                            if(err && !extService)
                            {
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

var AddSystemService = function(serviceInfo, callback)
{
    try
    {
        serviceInfo
            .save()
            .complete(function (err) {
                try {
                    if (err)
                    {
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



var GetBaseServiceDetailsById = function(baseServiceId, callback)
{
    try
    {
        dbModel.BaseService.find({where: [{id: baseServiceId}], include : [{model: dbModel.AttachedService, as: "AttachedService"}]})
            .complete(function (err, serviceInfo)
            {
                callback(err, serviceInfo);
            });

    }
    catch(ex)
    {
        callback(ex, undefined);
    }

};

var GetExtendedServiceDetailsById = function(extServiceId, callback)
{
    try
    {
        dbModel.ExtendedService.find({where: [{id: extServiceId}], include : [{model: dbModel.BaseService, as: "BaseService"}], include: [{model: dbModel.AttachedService, as: "AttachedService"}]})
            .complete(function (err, serviceInfo)
            {
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