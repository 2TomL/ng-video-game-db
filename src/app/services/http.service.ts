import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';
import { APIResponse, Game } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private rapidApiKey = 'edbb1b1bb3mshd01e55b2b432362p170af0jsnb241407192a4';
  private rapidApiHost = 'rawg-video-games-database.p.rapidapi.com';

  constructor(private http: HttpClient) { }

  getGameList(
    ordering: string,
    search?: string
  ): Observable<APIResponse<Game>> {
    let params = new HttpParams().set('ordering', ordering);

    if (search) {
      params = params.set('search', search);
    }

    const headers = new HttpHeaders({
      'X-RapidAPI-Key': this.rapidApiKey,
      'X-RapidAPI-Host': this.rapidApiHost
    });

    return this.http.get<APIResponse<Game>>(`${env.BASE_URL}/games`, {
      params: params,
      headers: headers
    });
  }

  getGameDetails(id: string): Observable<Game> {
    const headers = new HttpHeaders({
      'X-RapidAPI-Key': this.rapidApiKey,
      'X-RapidAPI-Host': this.rapidApiHost
    });

    const gameInfoRequest = this.http.get(`${env.BASE_URL}/games/${id}`, { headers });
    const gameTrailersRequest = this.http.get(`${env.BASE_URL}/games/${id}/movies`, { headers });
    const gameScreenshotsRequest = this.http.get(`${env.BASE_URL}/games/${id}/screenshots`, { headers });

    return forkJoin({
      gameInfoRequest,
      gameScreenshotsRequest,
      gameTrailersRequest,
    }).pipe(
      map((resp: any) => {
        return {
          ...resp['gameInfoRequest'],
          screenshots: resp['gameScreenshotsRequest']?.results,
          trailers: resp['gameTrailersRequest']?.results,
        };
      })
    );
  }
}