//我的音乐播放器js

console.log('start')

//曲库
var songs = {
	'Yesterday Once More': 'Carpenters',
	'绝世': '张克帆',
	'早知如此': '泰文',
	'每当那样时': '韩文',
}
//显示歌名和作者
var nameDisplay = function() {
	var currentSong = $('.current-song').text()
    var len = currentSong.length
    var name = currentSong.slice(0, len-4)
    $('#id-h1-song-title').text(name)
	$('em').text('By '+songs[name])
}
//根据传入的song进行播放
var songSwitch = function(song) {
    $('#id-audio-player').attr('src', `songs/${song.text()}`)
    $('.current-song').removeClass('current-song')
    song.addClass('current-song')
	$('#id-audio-player')[0].play()
    nameDisplay()
}
//上一首按钮
var prevSong = function(button) {
	console.log('上一首')
	var currentSong = $('.current-song')
    var currentIndex = currentSong.index()
    console.log('currentIndex-->', currentIndex)
    var prevIndex = (currentIndex + 3) % 4
    var songList = $('.single-song')
    var prevSong = $(songList[prevIndex])
    console.log('prevSong-->', prevSong.text())
    songSwitch(prevSong)
}
//下一首按钮
var nextSong = function(button) {
	console.log('下一首')
	var currentSong = $('.current-song')
    var currentIndex = currentSong.index()
    console.log('currentIndex-->', currentIndex)
    var nextIndex = (currentIndex + 1) % 4
    var songList = $('.single-song')
    var nextSong = $(songList[nextIndex])
    console.log('nextSong-->', nextSong.text())
    songSwitch(nextSong)
}
//播放按钮
var playSong = function(button) {
	console.log('播放')
	var player = $('#id-audio-player')[0]
	player.play()
	button.dataset.action = 'pause'
	$('.triangle-right').addClass('off')
	$('.stop-rectangle').removeClass('off')
	nameDisplay()
}
//暂停按钮
var pauseSong = function(button) {
	console.log('暂停')
	var player = $('#id-audio-player')[0]
	player.pause()
	button.dataset.action = 'play'
	$('.stop-rectangle').addClass ('off')
	$('.triangle-right').removeClass('off')
}
//绑定三个控制按钮
var bindControlEvents = function () {
	$('.button').on('click', function(event) {
		var button = event.currentTarget		//currentTarget始终是监听事件者，而target是事件的真正发出者
		//console.log('button', button)
		var action = button.dataset.action
		//console.log('action', action)
		var actions = {
			prev: prevSong,
			play: playSong,
			pause: pauseSong,
			next: nextSong,
		}
		var func = actions[action]  //得到函数
		//console.log('func', func)
		func(button)				//运行该函数
	})
}


//点击喇叭出现音量滑条
var bindLaba = function() {
	$('.icon-laba').on('click', function() {
		$('.volume-slider').toggleClass('active')
		//console.log($('.volume-slider')[0])
	})
}

//设置音量
var setVolume = function(num) {
	var player = $('#id-audio-player')[0]
	console.log('player', player)
    var value = num / 100
	console.log(value, typeof(value))
    player.volume = value
}
//得到音量滑条的值
var bindAudioVolume = function() {
	$('.volume-slider').on('change', function(event) {
		var value = event.target.value
		//console.log(value, typeof(value))
		var num = parseInt(value)
		setVolume(num)
	})
}


//滑条
var createHoverState = function(myobject){
	myobject.on('hover', function() {
		$(this).prev().toggleClass('hilite')
	})
	myobject.on('mousedown', function() {
		$(this).prev().addClass('dragging')
		$("*").on('mouseup', function() {
			$(myobject).prev().removeClass('dragging')
		})
	})
}

$(".slider").slider({
	orientation: "horizontal",
	range: "min",
	max: 100,
	value: 0,
})


//滑条跟随音乐
//将音乐时间转换为滑条值
var setSliderValue = function(value) {
	var time = value * 100
	$( ".slider" ).slider( "option", "value", time )
}
//补全时间
var zfill = function(n, width) {
    /*
    n 是 int 类型
    width 是 int 类型
    把 n 的位数变成 width 这么长，并在右对齐，不足部分用 0 补足并返回
    */
    var n1 = String(n)
    var d = width - n1.length
    for( var i = 0; i < d; i++) {
        n1 = '0' + n1
    }
    return n1
}
//时间文本
var timeText = function(time) {
	var minute = Math.floor(time / 60)
	var second = Math.floor(time % 60)
	var t = `${zfill(minute, 2)}:${zfill(second, 2)}`
	return t
}
//得到当前音乐时间，滑条随音乐滑动,时间文本随音乐变化
var bindTimeSlider = function() {
	var player = $('#id-audio-player')
	player.on('timeupdate', function(event) {
		var self = event.target
		var value = self.currentTime / self.duration
		//console.log('value', value)
		$('.slider').valueTime = self.currentPlaybackTime
		setSliderValue(value)

		//时间随文本变化
		var timeNow = self.currentTime
		var timeAll = self.duration
		//console.log('timeAll', timeAll)
		var changeTimeNow = timeText(timeNow)
		var changeTimeAll = timeText(timeAll)
		$('.time-current').text(changeTimeNow)
		$('.time-duration').text(changeTimeAll)
	})
	//加载音乐完成后，滑条归位，时间归位
	player.on('ended', function(event) {
		$('.time-current').text('0:00')
		$('.time-duration').text('0:00')
		$( ".slider" ).slider( "option", "value", 0 )
	})
	//音乐播放完成后,选择播放模式

}

//音乐跟随滑条
//用滑条百分比算出音乐现在时
var setSongNow = function(num) {
	var player = $('#id-audio-player')[0]
	console.log('player', player)
    var time = player.duration * num / 100
	console.log('time', time)
    player.currentTime = time

}
//得到滑条百分比
var bindAudioSlider = function() {
	console.log('音乐跟随滑条1')
	$('.slider').on('mousedown', function(event, ui) {

		var self = $(event.currentTarget)
		console.log('self', self)

		var value = self.slider("value")
		console.log('value:', value, typeof(value))
		setSongNow(value)
	})
}


//主函数
var _main = function() {
	createHoverState($(".slider a.ui-slider-handle"))
	bindControlEvents()	//控制按钮
	bindTimeSlider()	//滑条跟随音乐
	bindAudioSlider()	//音乐跟随滑条
	bindLaba()			//绑定喇叭
	bindAudioVolume()	//控制音量
}
_main()

console.log('end')
