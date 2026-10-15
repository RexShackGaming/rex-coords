fx_version 'cerulean'
rdr3_warning 'I acknowledge that this is a prerelease build of RedM, and I am aware my resources *will* become incompatible once RedM ships.'
game 'rdr3'
lua54 'yes'

author 'RexShackGaming'
description 'rex-coords - admin coordinate copy tool for RSG Framework'
version '3.0.0'

shared_scripts { '@ox_lib/init.lua', 'shared/config.lua' }
client_script 'client/client.lua'
server_scripts { 'server/server.lua', 'server/versionchecker.lua' }

ui_page 'html/index.html'
files { 'html/index.html', 'html/style.css', 'html/script.js', 'locales/*.json' }

dependencies { 'rsg-core', 'ox_lib' }
