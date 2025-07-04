AddStateBagChangeHandler('isLoggedIn', ('player:%s'):format(cache.serverId), function(_, _, value)
    if not value then client.onLogout() end
end)

RegisterNetEvent('qbx_core:client:onGroupUpdate', function(groupName, groupGrade)
    local groups = PlayerData.groups
    if not groupGrade then
        groups[groupName] = nil
    else
        groups[groupName] = groupGrade
    end
    client.setPlayerData('groups', groups)
end)

RegisterNetEvent('qbx_core:client:setGroups', function(groups)
    client.setPlayerData('groups', groups)
end)

RegisterNetEvent('QBCore:Client:OnMoneyChange', function(moneytype, amount, operation)
    local money = PlayerData.money
    if not money then return end

    if operation == 'add' then
        money[moneytype] = money[moneytype] + amount
    elseif operation == 'remove' then
        money[moneytype] = money[moneytype] - amount
    elseif operation == 'set' then
        money[moneytype] = amount
    end
    client.setPlayerData('money', money)

    SendNUIMessage({
        action = 'onMoneyChange',
        data = PlayerData.money
    })
end)

---@diagnostic disable-next-line: duplicate-set-field
function client.setPlayerStatus(values)
    local playerState = LocalPlayer.state
    for name, value in pairs(values) do
        -- compatibility for ESX style values
        if value > 100 or value < -100 then
            value = value * 0.0001
        end

        playerState:set(name, playerState[name] + value, true)
    end
end
