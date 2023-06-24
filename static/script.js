function q(selector) { 
    return document.querySelector(selector);
}

function setStatus(str)
{
    q("#status-bar").textContent = "Status: " + str;
}


function play_audio(e)
{
    q("#audio").play();
    e.preventDefault();
    return false;
}
function stop_audio(e)
{
    q("#audio").pause();
    q("#audio").currentTime = 0;
    e.preventDefault();
    return false;
}

function downloadBlob(blob, name = 'file.txt') {
    if (
      window.navigator && 
      window.navigator.msSaveOrOpenBlob
    ) return window.navigator.msSaveOrOpenBlob(blob);

    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = data;
    link.download = name;

    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent('click', { 
        bubbles: true, 
        cancelable: true, 
        view: window 
      })
    );

    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);
}

function download_audio(e)
{
    downloadBlob(q('#audio').src, name='audio.wav')
//<a href="path/to/file" class="button" download>Some text</a>
}

function synthesize(text, langid) {
    fetch(`/api/tts?text=${encodeURIComponent(text)}&langid=${langid}`)
        .then(function (res) {
            if (!res.ok) throw Error(res.statusText)
            return res.blob()
        }).then(function (blob) {
            setStatus("The synthesis is ready");
            q('#doit').disabled = false;
            q('#button_play').disabled = false;
            q('#button_stop').disabled = false;
            q('#button_download').disabled = false;
            q('#audio').src = URL.createObjectURL(blob)
        }).catch(function (err) {
            setStatus("Error");
            q('#doit').disabled = false;
            q('#button_play').disabled = true;
            q('#button_stop').disabled = true;
            q('#button_download').disabled = true;
        })
}

function do_tts(e)
{
	const text = q('#text24').value;
    const language_flex = q("#flex").selectedIndex;

	if (text) {
        setStatus("Synthesis in progress");
        q('#doit').disabled = true;

        q('#button_play').disabled = true;
        q('#button_stop').disabled = true;
        q('#button_download').disabled = true;
        
        synthesize(text, language_flex);
    }
    e.preventDefault();
    return false;
}

q('#doit').addEventListener('click', do_tts)
q('#button_play').addEventListener('click', play_audio)
q('#button_stop').addEventListener('click', stop_audio)
q('#button_download').addEventListener('click', download_audio)

q('#range26').addEventListener("change", function(e) {
    q("#audio").volume = e.currentTarget.value / 10;
})