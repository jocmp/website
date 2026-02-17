MP4S := $(shell find static/uploads -name '*.mp4')
WEBMS := $(MP4S:.mp4=.webm)
POSTERS := $(MP4S:.mp4=.jpg)

.PHONY: dev videos

videos: $(WEBMS) $(POSTERS)

dev:
	hugo server

%.webm: %.mp4
	ffmpeg -i $< -c:v libvpx-vp9 -crf 30 -b:v 0 -an $@

%.jpg: %.mp4
	ffmpeg -i $< -vframes 1 -ss 0 -q:v 2 $@
