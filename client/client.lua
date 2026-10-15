local RSGCore = exports['rsg-core']:GetCoreObject()
lib.locale()
local isOpen = false

local function round(n)
    local m = 10 ^ Config.Decimals
    return math.floor(n * m + 0.5) / m
end

local function getData()
    local ped = PlayerPedId()
    local c = GetEntityCoords(ped)
    local h = GetEntityHeading(ped)
    local rot = GetEntityRotation(ped, 2)
    local found, groundZ = GetGroundZFor_3dCoord(c.x, c.y, c.z, false)
    return {
        x = round(c.x), y = round(c.y), z = round(c.z), h = round(h),
        groundZ = found and round(groundZ) or nil,
        rx = round(rot.x), ry = round(rot.y), rz = round(rot.z),
        decimals = Config.Decimals,
    }
end

local function getLocale()
    local keys = {
        'cl_title', 'cl_subtitle', 'cl_hint', 'cl_refresh', 'cl_close',
        'cl_copied', 'cl_refreshed', 'cl_position_updated',
        'cl_lbl_xyz', 'cl_lbl_xyzh', 'cl_lbl_ground', 'cl_lbl_table',
        'cl_lbl_heading', 'cl_lbl_rotation', 'cl_badge_raw', 'cl_badge_float',
    }
    local t = {}
    for _, k in ipairs(keys) do t[k] = locale(k) end
    return t
end

local function close()
    isOpen = false
    SetNuiFocus(false, false)
    SendNUIMessage({ action = 'close' })
end

RegisterNetEvent('rex-coords:client:open', function()
    isOpen = true
    SetNuiFocus(true, true)
    SendNUIMessage({ action = 'open', data = getData(), locale = getLocale() })
end)

RegisterNUICallback('refresh', function(_, cb)
    cb(getData())
end)

RegisterNUICallback('close', function(_, cb)
    close()
    cb('ok')
end)

AddEventHandler('onResourceStop', function(res)
    if res == GetCurrentResourceName() and isOpen then SetNuiFocus(false, false) end
end)
