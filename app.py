from flask import Flask, render_template, request, send_file
import torch
from pprint import pprint
from omegaconf import OmegaConf
from IPython.display import Audio, display
from threading import Lock
import io
from flask import abort

torch.hub.download_url_to_file('https://raw.githubusercontent.com/snakers4/silero-models/master/models.yml',
                               'latest_silero_models.yml',
                               progress=False)
models = OmegaConf.load('latest_silero_models.yml')


available_languages = list(models.tts_models.keys())
print(f'Available languages {available_languages}')

for lang in available_languages:
    _models = list(models.tts_models.get(lang).keys())
    print(f'Available models for {lang}: {_models}')




app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

lock = Lock()

@app.route("/api/tts", methods=["GET"])
def tts():
    with lock:
        text = request.args.get("text")
        langid = int(request.args.get("langid"))
        if langid == 0:
            language = 'ua'
            model_id = 'v3_ua'
            speaker = 'mykyta'
        elif langid == 1:
            language = 'ua'
            model_id = 'v3_ua'
            speaker = 'random'
        elif langid == 2:
            language = 'en'
            model_id = 'v3_en'
            speaker = 'en_0'
        elif langid == 3:
            language = 'en'
            model_id = 'v3_en'
            speaker = 'random'
        
        device = torch.device('cpu')
        model, example_text = torch.hub.load(repo_or_dir='snakers4/silero-models',
                                            model='silero_tts',
                                            language=language,
                                            speaker=model_id)
        model.to(device)
        print(f'LangId: {langid}')
        print(f'Speaker: {language} {model_id} {speaker}')
        print('===============================================')
        try:
            audio = model.apply_tts(text=text,
                        speaker=speaker,
                        sample_rate=48000)
            audio = Audio(audio, rate=48000)
            out = io.BytesIO(bytes(audio.data))
            return send_file(out, mimetype="audio/wav")
        except Exception as e:
            print(type(e))
            print(e.args)  
            print(e) 
            
        return abort(500)
    