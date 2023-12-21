import {
    ActivatedRoute,
    ActivatedRouteSnapshot,
    ResolveFn,
    Route,
    Router,
    RouterModule,
    RouterStateSnapshot,
} from '@angular/router';
import { NgModule, inject } from '@angular/core';
import { ImageComponent } from '../image/image.component';
import { ImageListComponent } from './image-list.component';
import { ImagePopupComponent } from '../image-popup/image-popup.component';
import { CollectionMetadata, MetadataService } from '../../services/metadata.service';
import { EMPTY, NEVER, Observable, map } from 'rxjs';

const rootResolver: ResolveFn<Observable<CollectionMetadata>> = (
    routeSnapshot: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const router = inject(Router);
    const activatedRoute = inject(ActivatedRoute);
    const rootId = Number.parseInt(routeSnapshot.paramMap.get('rootId') ?? '');
    const service = inject(MetadataService);
    return service.getImagesMetadata(isNaN(rootId) ? undefined : rootId).pipe(
        map((x) => {
            if (isNaN(rootId) && x) {
                router.navigate(['imagelist', x.rootId], { relativeTo: activatedRoute });
            }
            return EMPTY;
        })
    );
};

const ROUTES: Route[] = [
    {
        path: 'imagelist/:rootId',
        component: ImageListComponent,
        children: [{ path: ':id', component: ImagePopupComponent }],
    },
    {
        path: 'imagelist',
        component: ImageListComponent,
        resolve: { someData: rootResolver },
    },
];

@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class ImageListRoutingModule {}
