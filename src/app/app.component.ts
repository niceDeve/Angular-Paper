import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { NoteService } from './services/note.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'notes';
  inputElement: ElementRef;
  noteText = "";
  public isSidebarVisible: Boolean = false;

  constructor(private element: ElementRef, private renderer: Renderer2, private swUpdate: SwUpdate, private noteService: NoteService) { }

  ngAfterViewInit(): void {

    this.renderer.listen(this.element.nativeElement, 'paste', (event) => {
      navigator['clipboard'].readText().then(clipText => {
        this.noteText = clipText
        console.log(clipText)
      });
    });

  }
  isMobile() {
    // if we want a more complete list use this: http://detectmobilebrowsers.com/
    // str.test() is more efficent than str.match()
    // remember str.test is case sensitive
    var isMobile = (/iphone|ipod|android|ie|blackberry|fennec/).test
      (navigator.userAgent.toLowerCase());
    return isMobile;
  }

  ngOnInit(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm("New version available. Load New Version?")) {
          window.location.reload();
        }
      });
    }
    this.noteService.isSideBarVisible.subscribe((val) => {
      this.isSidebarVisible = val;
    })
    if (!this.isMobile()) {
      this.noteService.isSideBarVisible.next(true);
    } else {
      this.noteService.isSideBarVisible.next(false);
    }
  }

}
