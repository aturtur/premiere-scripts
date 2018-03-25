// not ready
var seq = app.project.activeSequence;

var seqName = seq.name;
var resHeight = seq.frameSizeVertical;
var resWidth = seq.frameSizeHorizontal;
var tick = seq.timebase;
var fps;
switch(tick) {
    case 25401600000:
        fps = 10;
        break;
    case 21168000000:
        fps = 12;
        break;
    case 20321280000:
        fps = 12.5;
        break;
    case 16934400000:
        fps = 15;
        break;
    case 10594584000:
        fps = 23.973;
        break;
    case 10584000000:
        fps = 24;
        break;
    case 10160640000:
        fps = 25;
        break;
    case 8475667200:
        fps = 29.97;
        break;
    case 8467200000:
        fps = 30;
        break;
    case 5080320000:
        fps = 50;
        break;
    case 4237833600:
        fps = 59.94;
        break;
    case 4233600000:
        fps = 60;
        break;
    default:
        fps = 25;
}

var track = seq.videoTracks[0];
var clipCount = track.clips.numItems;


// fusion comp basics
var compStart = "Composition {\
    CurrentTime = 0,\
    RenderRange = { 0, 1000 },\
    GlobalRange = { 0, 1000 },\
    CurrentID = 10,\
    PlaybackUpdateMode = 0,\
    Version = \"Fusion 9.0.2 build 15\",\
    SavedOutputs = 2,\
    HeldTools = 0,\
    DisabledTools = 0,\
    LockedTools = 0,\
    AudioOffset = 0,\
    AutoRenderRange = true,\
    Resumable = true,\
    OutputClips = {\
    },\
    Tools = {"

var compEnd = " },\
    Prefs = {\
        Comp = {\
            Views = {\
                Right = {\
                },\
                Left = {\
                    Viewer = {\
                    },\
                },\
                View1 = {\
                },\
            },\
            FrameFormat = {\
                Rate = "+fps+",\
                GuideRatio = 1.77777777777778,\
                DepthFull = 2,\
                DepthPreview = 2,\
                DepthInteractive = 2,\
            },\
            Unsorted = {\
                GlobalEnd = 100\
            },\
            Paths = {\
            },\
            FlowView = {\
                GridSnap = true,\
            },\
            QuickTime = {\
            },\
        }\
    }\
}"

var loaders = [];
for (var i = 0; i < clipCount; i++){
    var clip = track.clips[i];

    var metadata = clip.projectItem.getProjectMetadata();
    var split = metadata.split("MediaDuration>")[1];
    var duration = split.split("<")[0];
    var HH = parseInt(duration.split(":")[0]);
    var MM = parseInt(duration.split(":")[1]);
    var SS = parseInt(duration.split(":")[2]);
    var FF = parseInt(duration.split(":")[3]);
    var HF = (HH*3600)*fps;
    var MF = (MM*60)*fps;
    var SF = SS*fps

    var fileName = clip.projectItem.getMediaPath();
    fileName = fileName.replace(/\\/g , "\\\\");
    fileName = "\""+fileName+"\"";
    
    var length = HF+MF+SF+FF;
    var trimIn = clip.inPoint.ticks/tick;
    var trimOut= (clip.outPoint.ticks/tick)-1;

    var loader = "Loader"+i+1+" = Loader {\
        Clips = {\
        Clip {\
        ID = Clip"+i+1+",\
        Filename = "+fileName+",\
        FormatID= \"QuickTimeMovies\",\
        Length = "+length+",\
        Multiframe = true,\
        TrimIn = "+trimIn+",\
        TrimOut = "+trimOut+",\
        ExtendFirst = 0,\
        ExtendLast = 0,\
        Loop = 1,\
        AspectMode = 0,\
        Depth = 0,\
        TimeCode = 0,\
        GlobalStart = 0,\
        GlobalEnd = 1000\
        }\
        },\
        CtrlWZoom = false,\
        Inputs = {\
                [\"Gamut.SLogVersion\"] = Input { Value = FuID { \"SLog2\" }, },\
            },\
            ViewInfo = OperatorInfo { Pos = { 100, "+parseInt(i)*parseInt(100)+" } },\
        }";
    loaders.push(loader);

}
loaders = loaders.join(",");
//alert(loaders);

var comp = compStart+loaders+compEnd;

var theFile = File.saveDialog("Where to save?", "Fusion Composition:*.comp");

if (theFile != null) {
   theFile.open("w","TEXT","????");
            theFile.writeln(comp);
   theFile.close();
   //theFile.execute();
}