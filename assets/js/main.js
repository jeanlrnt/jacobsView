
let crop_list = Array()
let uri = './data/jacobs.json'

function appendAnnonce(node) {
    node.append(`
    <div class='annonce'>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9459995325290769"
             crossorigin="anonymous"></script>
        <!-- annonce 1 -->
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-9459995325290769"
             data-ad-slot="4182914985"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
    </div>`)
}

function diffToString(diff) {
    let dateformated = ''
    diff.subtract(1, 'hour')
    if (diff.second() > 0)
    {
        dateformated = diff.second() + 's'
    }
    if (diff.minute() > 0)
    {
        dateformated = diff.minute() + 'm ' + dateformated
    }
    if ((diff.hour()) > 0)
    {
        dateformated = (diff.hour()) + 'h ' + dateformated
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
        loadContests([crop])
        $('.btn.btn-primary[data-crop]').addClass('btn-info').removeClass('btn-primary')
        $(`.btn.btn-info[data-crop="${crop}"]`).addClass('btn-primary').removeClass('btn-info')
        crop_list = Array(crop)
    })
}

function loadContests(items = null) {
    if (items === null) {
        items = ["Cactus","Sugar Cane","Nether Wart","Wheat","Mushroom","Cocoa Beans","Potato","Melon","Pumpkin","Carrot"]
    }
    $.ajax({
        url:uri,
        crossOrigin: true,
        method:'GET',
        dataType: 'JSON',
        success : function (data) {
            let count = 0;
            let contest_list = $('#contest_list')
            contest_list.empty()
            for (const event of data) {
                let contains_crop = false
                for (const crop of event.crops) {
                    for (const item of items) {
                        if (crop === item) {
                            contains_crop = true
                        }
                    }
                }
                if (contains_crop) {
                    let datetime = new Date(event.time * 1000)
                    if (moment(datetime).diff(moment()) > -1200000) {

                        /*if (count % 5 === 0) {
                            appendAnnonce($("#contest_list"))
                        }*/

                        $('#contest_list')
                            .append(`<div id="${event.time}" class="justify-content-center text-center mx-auto col-sm-6 contest bg-light"><h6></h6><div class="crops row gx-0"></div></div>`)

                        appendContestTime($(`#${event.time}`), datetime)
                        for (const crop of event.crops) {
                            let node = $(`#${event.time}>.crops`)
                            appendCrop(node, crop)
                        }
                        count += 1;
                    }
                }
            }
            contest_list.prepend(`<h5 class="text-center pt-2">${count} contests found</h5>`)
            if (count === 0){
                $('#contest_list').append("<h6 class='text-center'>No contests were found, if it's new year or Hypixel is down, be patient, contests will return soon</h6>")
            }
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
        diff = moment(moment(datetime).diff(moment())).add(20, 'minutes')
        dateformated = 'Starts: ' + diffToString(diff) + ' ago'
        parent.removeClass('bg-light').addClass('bg-danger')
    }
    parent.children('h6').text(dateformated)
}

function updateContestsTime() {
    $.ajax({
        url:uri,
        crossOrigin: true,
        method:'GET',
        dataType: 'JSON',
        async:false,
        success : function (data) {
            for (const event of data) {
                let datetime = new Date(event.time * 1000)
                let count = 0
                if (moment(datetime).diff(moment()) > -1200000) {
                    appendContestTime($(`#${event.time}`), datetime)
                    count += 1
                } else {
                    $(`#${event.time}`).remove()
                }
            }
            $('#contest_list>h5:first-child').html(`${count} contests found`)
        }
    })
}

$(document).ready(() => {
    loadContests()
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
