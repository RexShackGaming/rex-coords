local RSGCore = exports['rsg-core']:GetCoreObject()
lib.locale()

RSGCore.Commands.Add(Config.Command, locale('sv_lang_1'), {}, false, function(source)
    TriggerClientEvent('rex-coords:client:open', source)
end, Config.Permission)
