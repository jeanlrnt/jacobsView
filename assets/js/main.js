let crop_list = Array()
let allCrops = ["Cactus","Sugar Cane","Nether Wart","Wheat","Mushroom","Cocoa Beans","Potato","Melon","Pumpkin","Carrot"]
let uri = './data/jacobs.json'
let allData = {}

function diffToString(diff) {
    let dateformated = ''
    diff.subtract(1, 'hour')
    if (diff.second() > 0)
    {
        dateformated = (diff.second() < 10 ? '0' + diff.second() : diff.second()) + 's'
    }
    if (diff.minute() > 0)
    {
        dateformated =  (diff.minute() < 10 ? '0' + diff.minute() : diff.minute()) + 'm ' + dateformated
    }
    if ((diff.hour()) > 0)
    {
        dateformated =  ((diff.hour()) < 10 ? '0' + (diff.hour()) : diff.hour()) + 'h ' + dateformated
    }
    if (diff.dayOfYear()-1 > 0)
    {
        dateformated = (diff.dayOfYear()-1) + 'd ' + dateformated
    }
    return dateformated
}

function appendCrop(parent, crop) {
    let imgPath = '';
    let name = '';
    switch (crop) {
        case 'Nether Wart':
            imgPath = './assets/img/nether_wart.png';
            name = 'Nether wart';
            break;
        case 'Sugar Cane':
            imgPath = './assets/img/sugar_cane.png';
            name = 'Sugar cane';
            break;
        case 'Wheat':
            imgPath = './assets/img/wheat.png';
            name = 'Wheat';
            break;
        case 'Cactus':
            imgPath = './assets/img/cactus.png';
            name = 'Cactus';
            break;
        case 'Mushroom':
            imgPath = './assets/img/mushroom.png';
            name = 'Mushroom';
            break;
        case 'Cocoa Beans':
            imgPath = './assets/img/cocoa_beans.png';
            name = 'Cocoa beans';
            break;
        case 'Potato':
            imgPath = './assets/img/potato.png';
            name = 'Potato';
            break;
        case 'Melon':
            imgPath = './assets/img/melon.png';
            name = 'Melon';
            break;
        case 'Pumpkin':
            imgPath = './assets/img/pumpkin.png';
            name = 'Pumpkin';
            break;
        case 'Carrot':
            imgPath = './assets/img/carrot.png';
            name = 'Carrot';
            break;
    }
    parent.append(`<div class="col-md-4 crop-item" data-crop="${crop}"><img src="${imgPath}" class="crop-img" alt="${name}"><p>${name}</p></div>`)
    $('.crop-item:last').on('click', function () {
        getContests([crop])
        $('.btn.btn-primary[data-crop]').addClass('btn-info').removeClass('btn-primary')
        $(`.btn.btn-info[data-crop="${crop}"]`).addClass('btn-primary').removeClass('btn-info')
        crop_list = Array(crop)
    })
}

function loadContests(items = allCrops) {
    let count = 0;
    let contest_list = $('#contest_list')
    contest_list.empty()
    allData.map(event => {
        let contains_crop = false
        event.crops.map(crop => {
            items.map(item => {
                if (crop === item) {
                    contains_crop = true
                }
            })
        })
        if (contains_crop) {
            let datetime = new Date(event.time * 1000)
            if (moment(datetime).diff(moment()) > -1200000) {

                contest_list.append(`<div id="${event.time}" class="justify-content-center text-center mx-auto col-lg-6 contest bg-light"><h6></h6><div class="crops row gx-0"></div></div>`)

                appendContestTime($(`#${event.time}`), datetime)
                event.crops.map(crop => {
                    let node = $(`#${event.time}>.crops`)
                    appendCrop(node, crop)
                })
                count += 1;
            }
        }
    })
    contest_list.prepend(`<h5 class="text-center pt-2">${count} contests found</h5>`)
    if (count === 0){
        $('#contest_list').append("<h6 class='text-center'>No contests were found, if it's new year or Hypixel is down, be patient, contests will return soon</h6>")
    }
}

function getContests(items = null) {
    if (items === null) {
        items = allCrops
    }
    $.ajax({
        url:uri,
        crossOrigin: true,
        method:'GET',
        dataType: 'JSON',
        success : function (data) {
            allData = data;
            loadContests(items)
        },
        error: function (error)  {
            console.log(error)
        }
    })
}

function appendContestTime(parent, datetime) {

    let diff
    let dateformated

    if (moment(datetime).diff(moment()) > 0){
        diff = moment(moment(datetime).diff(moment()))
        dateformated = 'Starts in: ' + diffToString(diff)
        if (moment(datetime).diff(moment()) < 300000) {
            parent.removeClass('bg-light').addClass('bg-warning')
        } else {
            parent.removeClass('bg-light').addClass('bg-success')
        }
    } else {
        diff = moment(moment(moment()).diff(datetime))
        dateformated = 'Starts: ' + diffToString(diff) + ' ago'
        parent.removeClass('bg-light').addClass('bg-danger')
    }
    parent.children('h6').text(dateformated)
}

function updateContestsTime() {
    allData.map(event => {
        let datetime = new Date(event.time * 1000)
        if (moment(datetime).diff(moment()) > -1200000) {
            appendContestTime($(`#${event.time}`), datetime)
        } else {
            $(`#${event.time}`).remove()
        }
    })
    updateContestsCount(crop_list.length === 0 ? allCrops : crop_list)
}

function updateContestsCount(crops) {
    let count = 0
    allData.map(event => {
        let contains = false
        event.crops.map(crop => {
            let datetime = new Date(event.time * 1000)
            if (moment(datetime).diff(moment()) > -1200000) {
                if (crops.includes(crop)) {
                    contains = true
                }
            }
        })
        if (contains) {
            count += 1
        }
    })
    $('#contest_list>h5:first-child').html(`${count} contest${count > 1 ? 's' : '' } found`)
}

$(document).ready(() => {
    getContests()
    setInterval(function () {
        updateContestsTime()
    }, 1000)

    $('.btn[data-crop]').on('click', function () {
        $(this).toggleClass('btn-info').toggleClass('btn-primary')
        let crop_name = $(this).data('crop');
        if (crop_list.includes(crop_name)) {
            crop_list.splice(crop_list.indexOf(crop_name),1)
        } else {
            crop_list.push(crop_name)
        }
        if (crop_list.length > 0) {
            loadContests(crop_list)
        } else {
            loadContests()
        }
    })
})
