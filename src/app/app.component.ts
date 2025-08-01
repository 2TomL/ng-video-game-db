import { Component, OnInit } from '@angular/core';
import { HttpService } from './services/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Video-Games-DB';
  
  constructor(private httpService: HttpService) {}
  ngOnInit(): void {
    this.httpService
      .getGameList('some_ordering', 'search_query')
      .subscribe((data) => {
        // Handle the API response here
      });

    this.httpService.getGameDetails('game_id').subscribe((data) => {
      // Handle the API response here
    });
  }
}
