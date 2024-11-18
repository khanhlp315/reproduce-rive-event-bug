import {Alignment, EventType, Fit, Layout, useRive} from "@rive-app/react-canvas";
import {useCallback, useEffect, useState} from "react";

function App() {

  const [currentArtboard, setCurrentArtboard] = useState(1)
  const { rive, RiveComponent } = useRive({
    src: './reproduce-event-bug.riv',
    stateMachines: 'State Machine',
    layout: new Layout({
      fit: Fit.FitHeight, // Change to: rive.Fit.Contain, or Cover
      alignment: Alignment.Center,
    }),
    artboard: `Artboard${currentArtboard}`,
    autoplay: true,
  });

  useEffect(() => {
    const artboardName = `Artboard${currentArtboard}`
    if(rive?.activeArtboard && rive.activeArtboard !== artboardName){
      rive?.reset({
        artboard: `Artboard${currentArtboard}`,
        autoplay: true,
        stateMachines: 'State Machine',
      })
    }

  }, [currentArtboard])


  const onNavigate = useCallback(() => {
    setCurrentArtboard(3-currentArtboard);

  }, [currentArtboard]);

  const riveCallback = useCallback(
      // biome-ignore lint/suspicious/noExplicitAny: cannot determine riveEvent type
      async (riveEvent: any) => {
        console.log('Event from rive', riveEvent);
        if (riveEvent.data?.name ===('OnNavigate')) {
          onNavigate?.();
        }
      },
      [onNavigate],
  );

  useEffect(() => {
    if (rive) {
      console.log('Welcome enable event');
      rive.on(EventType.RiveEvent, riveCallback);
      return () => {
        console.log('Welcome disable event');
        rive.off(EventType.RiveEvent, riveCallback);
      };
    }
    return () => {};
  }, [rive, riveCallback]);

  return (
      <div style={{width: '100dvh', height: '100dvh'}}>
        <RiveComponent/>
      </div>
  )
}

export default App
